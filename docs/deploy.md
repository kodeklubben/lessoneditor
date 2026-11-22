# Deployment

Merging does not deploy. Deploys are manual, through the **Deploy (manual)** workflow.

| Part | Where |
|---|---|
| Editor (backend and frontend) | App Engine standard, service `default`, project `lessoneditor`, region `europe-west`: https://lessoneditor.ew.r.appspot.com |
| Database | Cloud SQL `lessoneditor` (PostgreSQL 16), `europe-north1`. Daily backups (7 kept), point-in-time recovery for 7 days, deletion protection. |
| Thumbnails | App Engine service `thumbnailer`: https://thumbnailer-dot-lessoneditor.ew.r.appspot.com. See [its README](../apps/thumbnailer/README.md). |

## One-time setup in GitHub

In **Settings → Environments → `production`**:

- Secrets: `SERVICE_ACCOUNT`, `POSTGRES_PASSWORD`, `GH_CLIENT_SECRET`, `COOKIE_SECRET`, `SESSION_SECRET`, `JWT_SECRET`. The last three are random and distinct (`openssl rand -hex 32`); `JWT_SECRET` must differ from `GH_CLIENT_SECRET`.
- For test versions, a second GitHub OAuth app (an OAuth app has only one callback URL) with homepage `https://test-dot-lessoneditor.ew.r.appspot.com` and callback `https://test-dot-lessoneditor.ew.r.appspot.com/api/auth/callback`: its client ID as the variable `TEST_GH_CLIENT_ID` and its secret as `TEST_GH_CLIENT_SECRET`.
- Protection: require a reviewer. Do not limit the environment to `main`: test versions are deployed from branches, and the workflow itself only lets `main` get traffic.

The workflow refuses to run when any of these are missing.

## Every deploy

The workflow reruns CI, makes an on-demand Cloud SQL backup named after the commit, runs the migrations, deploys the thumbnail service and then the editor. Choose the mode when you start it, and type `production` to confirm; both modes use the production database.

### 1. Test a branch before merging

Run the workflow from the branch with mode **test**. It deploys the version `test` **without traffic**, with the test OAuth app and submissions to GitHub turned off, at:

```
https://test-dot-lessoneditor.ew.r.appspot.com
```

There is one test version at a time; the next test deploy replaces it.

Sign in with GitHub there and check: your lessons open, editing and autosave, images, new lesson and new text file, sharing, deleting, logout. Users stay on the current version meanwhile.

The test version gets its own thumbnail service version, `test`, at `https://test-dot-thumbnailer-dot-lessoneditor.ew.r.appspot.com`, so thumbnails can be checked there too (wait 10 s after saving).

The migrations run against the production database already at this step. Write them so the version that has traffic keeps working (add columns, do not rename or drop), or do not use test mode for that change.

Without traffic it scales down to no instances by itself; delete both when the branch is merged: `gcloud app versions delete test --service default --project lessoneditor` and `gcloud app versions delete test --service thumbnailer --project lessoneditor`.

### 2. Release after merging

1. Run the workflow from `main` with mode **production**. The new versions of the thumbnail service and the editor get all traffic.
2. Check sign-in, editing, a thumbnail (wait 10 s after saving) and logout on https://lessoneditor.ew.r.appspot.com.

### Roll back

- Editor: send the traffic back to the previous version, in the console (App Engine → Versions) or with `gcloud app services set-traffic default --splits <previous-version>=1 --project lessoneditor`.
- Thumbnails: the same, for the service `thumbnailer`: `gcloud app services set-traffic thumbnailer --splits <previous-version>=1 --project lessoneditor` (the deploy log prints it).
- Database: a migration with a `down` can be reverted with `npm run migration:revert` through the Cloud SQL Auth Proxy. A restore from the on-demand backup (`gcloud sql backups list` / `restore`) replaces the whole instance and loses everything written after it, so it is the last resort.

## Notes

The application binds to `0.0.0.0` in production and uses secure cookies behind App Engine's proxy. Its build runs from source through `gcp-build`; local `dist`, `.env` files and browser-test artifacts are excluded from upload.

Local smoke tests never deploy, migrate production or submit to GitHub. They use synthetic sessions and do not test the real OAuth handshake; the test version does.
