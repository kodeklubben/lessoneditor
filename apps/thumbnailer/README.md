# Thumbnail service

The service receives `GET ?url=<preview URL>&token=<short-lived token>` and returns a PNG. Only `/preview/:lessonId/:filename` on the configured `FRONTEND_URL` is accepted. Browser requests send authentication only to that origin. Request queues are bounded and errors do not include tokens.

## Local development

Install dependencies from the repository root with `npm ci`, then run `npm run browser:install`. The root `npm run dev` starts this service on port 3012 alongside the editor. To start it separately:

```sh
npm run build:thumbnailer
npm run dev:thumbnailer
```

Both commands run from the root. `.env` must set `FRONTEND_URL=http://localhost:4200`. The end-to-end smoke test exercises a real PNG capture against the local editor.

## Google Cloud

Deployment is a separate, manual operation. Confirm the existing function's generation, region and public endpoint before choosing whether to update it or create a replacement. Do not blindly switch a live first-generation function to second generation.

For a new second-generation deployment, prepare a standalone source directory with this package's `package.json`, compiled `dist/`, and a standalone npm lockfile. Set its `gcp-build` script to an empty string because compilation has already occurred. Apply the root project's `cloudevents`/`uuid` override in that standalone package. Keep the generated directory outside the source tree and do not copy `.env` files.

Use Node 24, entry point `thumbnailer`, adequate memory for Chromium (at least 1 GiB), and a request timeout of at least 60 seconds. Install Puppeteer's matching Chrome during the cloud build and ensure its cache is available at runtime; the root App Engine setting `PUPPETEER_SKIP_DOWNLOAD=true` is **not** suitable for this service. Configure `NODE_ENV=production` and `FRONTEND_URL` with the deployed editor origin.

Validate the new endpoint with an expiring token from the matching backend, then set the main application's `THUMB_SERVICE_URL`. The root deployment workflow deliberately requires this endpoint to be configured explicitly.
