# Production deployment

Production is intentionally separate from merging code. The `Deploy to production (manual)` workflow only runs from `main` when the input is `production`. It reuses CI, then runs database migrations before deploying App Engine on Node 24.

Before deploying this upgrade:

1. Verify the current Google Cloud project, Cloud SQL instance, database backup and OAuth callback. The checked-in instance configuration is `lessoneditor:europe-north1:lessoneditor`; verify it against the actual environment.
2. Configure GitHub's `production` environment with `SERVICE_ACCOUNT`, `POSTGRES_PASSWORD`, `GH_CLIENT_SECRET`, `COOKIE_SECRET` and `SESSION_SECRET`. Use distinct random cookie/session secrets. The workflow refuses to run without them.
3. Deploy and verify the updated thumbnail service separately, following its README. Configure its `FRONTEND_URL=https://lessoneditor.ew.r.appspot.com` and `NODE_ENV=production`.
4. Set the GitHub environment variable `THUMB_SERVICE_URL` to the verified thumbnail endpoint. The application and thumbnail service must be updated together because preview URL validation is now explicit.
5. Run the manual workflow from `main` and inspect migration and deployment results.
6. Check real GitHub sign-in, session persistence, editing, thumbnail generation, logout and a deliberately authorized GitHub submission in the deployed environment.

The application binds to `0.0.0.0` in production and uses secure cookies behind App Engine's proxy. Its build runs from source through `gcp-build`; local `dist`, `.env` files and browser-test artifacts are excluded from upload.

No production deployment, database migration or real GitHub submission is performed by local smoke tests. Browser tests use local synthetic sessions; they do not validate the external OAuth handshake.
