# Thumbnail service

The service receives `GET ?url=<preview URL>` with the short-lived token in the `X-Preview-Token` header and returns a PNG. A token in the query string is refused, because query strings are written to the request log. Deploy this service and the backend together: an older backend sends the token in the query string. Only `/preview/:lessonId/:filename` on the configured `FRONTEND_URL` is accepted. Browser requests send authentication only to that origin. Request queues are bounded and errors do not include tokens.

## Local development

Install dependencies from the repository root with `npm ci`, then run `npm run browser:install`. The root `npm run dev` starts this service on port 3012 alongside the editor. To start it separately:

```sh
npm run build:thumbnailer
npm run dev:thumbnailer
```

Both commands run from the root. `.env` must set `FRONTEND_URL=http://localhost:4200`. The end-to-end smoke test exercises a real PNG capture against the local editor.

## Google Cloud

The service runs as its own App Engine service, `thumbnailer`, in project `lessoneditor`:

| Mode | Address | Renders previews of |
|---|---|---|
| production | https://thumbnailer-dot-lessoneditor.ew.r.appspot.com | https://lessoneditor.ew.r.appspot.com |
| test | https://test-dot-thumbnailer-dot-lessoneditor.ew.r.appspot.com (version `test`, no traffic) | https://test-dot-lessoneditor.ew.r.appspot.com |

The **Deploy (manual)** workflow deploys it with `tools/deploy-thumbnailer.sh <mode>` right before the editor, and gives the editor the matching `THUMB_SERVICE_URL`. To deploy it by hand: `nvm use 24 && tools/deploy-thumbnailer.sh production` (logged in with `gcloud`). `DRY_RUN=1` builds the package without deploying.

The script packages the compiled `dist/` as a standalone package with its own lockfile and an `app.yaml`. Puppeteer's Chrome is installed during the cloud build into the source directory, so it is there at runtime. The service runs as `thumbnailer-runtime`, a service account with no roles.

It runs on one F4 instance (1 GB) at most two, and only while thumbnails are made. The first thumbnail after a quiet period waits a few seconds for an instance to start, and the instance stops after about 15 idle minutes. One instance takes up to 10 requests at a time; they wait in the service's own queue, one screenshot at a time.

App Engine, not Cloud Functions: a function needs an IAM invoker binding before the editor can call it, and only a project owner can grant one. An App Engine service is reachable without it. That is safe because the service only renders preview pages of its own editor, and those require a short-lived token the editor signs.

A real screenshot needs a token from the matching editor, so check a thumbnail in the editor after a deploy.
