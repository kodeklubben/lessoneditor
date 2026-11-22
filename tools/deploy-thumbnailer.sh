#!/usr/bin/env bash
# Deploys apps/thumbnailer to the existing Cloud Function "thumbnailer" (gen2, europe-north1).
#
# Run it right before the App Engine deploy: the new backend sends the preview token in the
# X-Preview-Token header, which only this version reads, and this version refuses the query-string
# token the old backend sends. Between the two deploys, thumbnails fail (saving is not affected).
#
# The function is updated in place, so its URL (THUMB_SERVICE_URL) and its public invoker binding
# are kept; creating or opening a new function needs setIamPolicy, which an Editor does not have.
# The previous revision is kept by Cloud Run; the script prints the command to roll back to it.
#
# Usage: tools/deploy-thumbnailer.sh   (logged in with gcloud, Node 24)
#        DRY_RUN=1 tools/deploy-thumbnailer.sh   builds the package only and prints where it is
set -euo pipefail

PROJECT=lessoneditor
REGION=europe-north1
FUNCTION=thumbnailer
FRONTEND_URL=https://lessoneditor.ew.r.appspot.com
# Its own identity with no roles: Chromium runs untrusted lesson content with --no-sandbox, and the
# default compute account it used before is Editor on the whole project.
RUNTIME_SA_NAME=thumbnailer-runtime
RUNTIME_SA=$RUNTIME_SA_NAME@$PROJECT.iam.gserviceaccount.com

cd "$(git rev-parse --show-toplevel)"
node -e 'if (!process.versions.node.startsWith("24.")) { console.error("Use Node 24 (nvm use 24)"); process.exit(1) }'

echo "== Building"
npm run build:thumbnailer

STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT
cp -R apps/thumbnailer/dist "$STAGE/dist"

# A standalone package: compiled already, only runtime dependencies, the root's uuid override for
# cloudevents, and Puppeteer's browser inside the source directory so the one downloaded during the
# cloud build is still there at runtime. gcp-build installs it explicitly instead of relying on
# Puppeteer's postinstall, which newer npm versions block unless the package is approved.
node - "$STAGE" <<'EOF'
const fs = require("fs");
const path = require("path");
const stage = process.argv[2];
const source = require(path.resolve("apps/thumbnailer/package.json"));
const root = require(path.resolve("package.json"));
const pkg = {
  name: source.name,
  version: source.version,
  private: true,
  main: source.main,
  scripts: {
    start: source.scripts.start,
    "gcp-build": "puppeteer browsers install chrome",
  },
  dependencies: source.dependencies,
  overrides: { cloudevents: root.overrides.cloudevents },
  engines: { node: source.engines.node },
};
fs.writeFileSync(path.join(stage, "package.json"), JSON.stringify(pkg, null, 2) + "\n");
fs.writeFileSync(
  path.join(stage, ".puppeteerrc.cjs"),
  'const { join } = require("path");\n' +
    'module.exports = { cacheDirectory: join(__dirname, ".cache", "puppeteer") };\n',
);
fs.writeFileSync(path.join(stage, ".gcloudignore"), ".gcloudignore\nnode_modules\n.cache\n");
EOF
(cd "$STAGE" && npm install --package-lock-only --ignore-scripts --no-audit --no-fund >/dev/null)

if [ "${DRY_RUN:-}" = 1 ]; then
  trap - EXIT
  echo "DRY_RUN: the package that would be deployed is in $STAGE"
  exit 0
fi

echo "== Runtime service account"
if ! gcloud iam service-accounts describe "$RUNTIME_SA" --project "$PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$RUNTIME_SA_NAME" --project "$PROJECT" \
    --display-name "Thumbnailer runtime (no roles)"
fi

PREVIOUS=$(gcloud run services describe "$FUNCTION" --project "$PROJECT" --region "$REGION" \
  --format='value(status.latestReadyRevisionName)')
echo "Current revision: $PREVIOUS"

echo "== Deploying"
gcloud functions deploy "$FUNCTION" \
  --project "$PROJECT" \
  --region "$REGION" \
  --gen2 \
  --runtime nodejs24 \
  --entry-point thumbnailer \
  --trigger-http \
  --source "$STAGE" \
  --service-account "$RUNTIME_SA" \
  --memory 2Gi \
  --cpu 1 \
  --timeout 120s \
  --concurrency 1 \
  --max-instances 5 \
  --set-env-vars "NODE_ENV=production,FRONTEND_URL=$FRONTEND_URL" \
  --quiet

URL=$(gcloud functions describe "$FUNCTION" --project "$PROJECT" --region "$REGION" \
  --format='value(url)')

echo "== Checking"
# Without a token the new code answers 400; a token in the query string is refused as well.
# A real screenshot needs a token from the new backend, so test that after the App Engine deploy.
for request in "$URL" "$URL?url=$FRONTEND_URL/preview/1/x&token=x"; do
  status=$(curl -s -o /dev/null -w '%{http_code}' --max-time 60 "$request")
  echo "$status  ${request/token=x/token=…}"
  [ "$status" = 400 ] || { echo "Expected 400" >&2; exit 1; }
done

echo
echo "Deployed. THUMB_SERVICE_URL=$URL"
echo "Roll back: gcloud run services update-traffic $FUNCTION --project $PROJECT --region $REGION --to-revisions $PREVIOUS=100"
