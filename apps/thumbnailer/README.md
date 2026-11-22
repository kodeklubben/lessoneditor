# Thumbnail service

The service receives `GET ?url=<preview URL>` with the short-lived token in the `X-Preview-Token` header and returns a PNG. A token in the query string is refused, because query strings are written to the request log. `Authorization` is left free for Google's ID token, so the function can be made private (IAM) without code changes. Deploy this service and the backend together: an older backend sends the token in the query string. Only `/preview/:lessonId/:filename` on the configured `FRONTEND_URL` is accepted. Browser requests send authentication only to that origin. Request queues are bounded and errors do not include tokens.

## Local development

Install dependencies from the repository root with `npm ci`, then run `npm run browser:install`. The root `npm run dev` starts this service on port 3012 alongside the editor. To start it separately:

```sh
npm run build:thumbnailer
npm run dev:thumbnailer
```

Both commands run from the root. `.env` must set `FRONTEND_URL=http://localhost:4200`. The end-to-end smoke test exercises a real PNG capture against the local editor.

## Google Cloud

Deploy with `tools/deploy-thumbnailer.sh` (Node 24, logged in with `gcloud`), right before the App Engine deploy: the new backend sends the token in `X-Preview-Token`, which an older thumbnailer does not read, and this version refuses the query-string token an older backend sends.

The script updates the existing second-generation function `thumbnailer` in `europe-north1` in place, so its URL (`THUMB_SERVICE_URL`) and its public invoker binding stay; creating or opening a new function needs `setIamPolicy`, which the Editor role does not have. It packages the compiled `dist/` as a standalone package with its own lockfile, installs Puppeteer's Chrome during the cloud build into the source directory (so it is there at runtime), and runs the function as `thumbnailer-runtime`, a service account with no roles, with 2 GiB, 1 CPU, a 120 s timeout and one request per instance. `DRY_RUN=1` builds the package without deploying. It prints the previous revision and the command to roll back to it.

A real screenshot needs a token from the matching backend, so check a thumbnail in the editor after the App Engine deploy.
