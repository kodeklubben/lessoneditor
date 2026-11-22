# Deployment

Merging does not deploy. Deploys are manual, through the **Deploy (manual)** workflow.

| Part | Where |
|---|---|
| Editor (backend and frontend) | App Engine standard, service `default`, project `lessoneditor`, region `europe-west`: https://lessoneditor.ew.r.appspot.com |
| Database | Cloud SQL `lessoneditor` (PostgreSQL 16), `europe-north1`. Daily backups (7 kept), point-in-time recovery for 7 days, deletion protection. |
| Thumbnails | Cloud Function `thumbnailer` (gen2), `europe-north1`: https://europe-north1-lessoneditor.cloudfunctions.net/thumbnailer |

## One-time setup in GitHub

In **Settings → Environments → `production`**:

- Secrets: `SERVICE_ACCOUNT`, `POSTGRES_PASSWORD`, `GH_CLIENT_SECRET`, `COOKIE_SECRET`, `SESSION_SECRET`, `JWT_SECRET`. The last three are random and distinct (`openssl rand -hex 32`); `JWT_SECRET` must differ from `GH_CLIENT_SECRET`.
- Variable: `THUMB_SERVICE_URL=https://europe-north1-lessoneditor.cloudfunctions.net/thumbnailer`.
- Protection: require a reviewer. Do not limit the environment to `main`: test versions are deployed from branches, and the workflow itself only lets `main` get traffic.

The workflow refuses to run when any of these are missing.

## Every deploy

The workflow reruns CI, makes an on-demand Cloud SQL backup named after the commit, runs the migrations and deploys App Engine. Choose the mode when you start it, and type `production` to confirm; both modes use the production database.

### 1. Test a branch before merging

Run the workflow from the branch with mode **test**. It deploys version `test-<commit>` **without traffic**, with submissions to GitHub turned off, at:

```
https://test-<commit>-dot-lessoneditor.ew.r.appspot.com
```

Sign in with GitHub there and check: your lessons open, editing and autosave, images, new lesson and new text file, sharing, deleting, logout. Users stay on the current version meanwhile.

Thumbnails are not made for a test version: the thumbnail service only accepts previews from the production address.

The migrations run against the production database already at this step. Write them so the version that has traffic keeps working (add columns, do not rename or drop), or do not use test mode for that change.

Delete the test version when done: `gcloud app versions delete test-<commit> --service default --project lessoneditor`.

### 2. Release after merging

1. Deploy the thumbnail service if `apps/thumbnailer` changed: `nvm use 24 && tools/deploy-thumbnailer.sh` (see [its README](../apps/thumbnailer/README.md)). It prints the command to roll it back.
2. Run the workflow from `main` with mode **production**. The new version gets all traffic.
3. Check sign-in, editing, a thumbnail (wait 10 s after saving) and logout on https://lessoneditor.ew.r.appspot.com.

### Roll back

- Editor: send the traffic back to the previous version, in the console (App Engine → Versions) or with `gcloud app services set-traffic default --splits <previous-version>=1 --project lessoneditor`.
- Thumbnails: the command `tools/deploy-thumbnailer.sh` printed.
- Database: a migration with a `down` can be reverted with `npm run migration:revert` through the Cloud SQL Auth Proxy. A restore from the on-demand backup (`gcloud sql backups list` / `restore`) replaces the whole instance and loses everything written after it, so it is the last resort.

## Notes

The application binds to `0.0.0.0` in production and uses secure cookies behind App Engine's proxy. Its build runs from source through `gcp-build`; local `dist`, `.env` files and browser-test artifacts are excluded from upload.

Local smoke tests never deploy, migrate production or submit to GitHub. They use synthetic sessions and do not test the real OAuth handshake; the test version does.
