#!/usr/bin/env bash
# Deploys apps/thumbnailer as the App Engine service "thumbnailer" in project lessoneditor.
#
#   tools/deploy-thumbnailer.sh production   new version with all traffic, for the production editor:
#                                            https://thumbnailer-dot-lessoneditor.ew.r.appspot.com
#   tools/deploy-thumbnailer.sh test         version "test" without traffic, for the test editor:
#                                            https://test-dot-thumbnailer-dot-lessoneditor.ew.r.appspot.com
#   DRY_RUN=1 tools/deploy-thumbnailer.sh …  builds the package only and prints where it is
#
# App Engine, not Cloud Functions: an App Engine service is reachable without an IAM invoker
# binding, which only a project owner can grant. The service is still not open to misuse: it only
# renders preview pages of its own editor (FRONTEND_URL), and those need a token signed by the editor.
#
# The "Deploy (manual)" workflow runs this before it deploys the editor; it can also be run by hand
# (logged in with gcloud, Node 24). It prints the command to roll back.
set -euo pipefail

PROJECT=lessoneditor
SERVICE=thumbnailer
MODE=${1:-}
case "$MODE" in
  production)
    FRONTEND_URL=https://lessoneditor.ew.r.appspot.com
    URL=https://$SERVICE-dot-$PROJECT.ew.r.appspot.com
    VERSION_ARGS=(--promote)
    ;;
  test)
    FRONTEND_URL=https://test-dot-lessoneditor.ew.r.appspot.com
    URL=https://test-dot-$SERVICE-dot-$PROJECT.ew.r.appspot.com
    VERSION_ARGS=(--version test --no-promote)
    ;;
  *)
    echo "Usage: $0 production|test" >&2
    exit 2
    ;;
esac
# Its own identity with no roles: Chromium runs lesson content with --no-sandbox, and the default
# App Engine account is Editor on the whole project.
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
node - "$STAGE" "$FRONTEND_URL" "$RUNTIME_SA" <<'EOF'
const fs = require("fs");
const path = require("path");
const [stage, frontendUrl, serviceAccount] = process.argv.slice(2);
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
// F4 (1 GB) holds Chromium with one page at a time. No instance runs while nobody saves: it starts
// on the first thumbnail (a few seconds) and stops after about 15 idle minutes. One instance
// takes up to 10 requests, which wait in the app's own queue, so a busy moment does not start more.
const appYaml = `service: thumbnailer
runtime: nodejs24
instance_class: F4
entrypoint: npm start
service_account: ${serviceAccount}
automatic_scaling:
  min_instances: 0
  max_instances: 2
  max_concurrent_requests: 10
env_variables:
  NODE_ENV: production
  FRONTEND_URL: ${JSON.stringify(frontendUrl)}
`;
fs.writeFileSync(path.join(stage, "app.yaml"), appYaml);
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

PREVIOUS=$(gcloud app versions list --project "$PROJECT" --service "$SERVICE" \
  --filter='traffic_split>0' --format='value(id)' 2>/dev/null | head -1 || true)
echo "Version with traffic now: ${PREVIOUS:-none}"

echo "== Deploying ($MODE)"
gcloud app deploy "$STAGE/app.yaml" --project "$PROJECT" "${VERSION_ARGS[@]}" --quiet

echo "== Checking $URL"
# Without a token it answers 400, and a token in the query string is refused as well. A real
# thumbnail needs a token from the editor: save a lesson and look at its preview image.
for request in "$URL" "$URL?url=$FRONTEND_URL/preview/1/x&token=x"; do
  status=000
  for _ in 1 2 3 4 5 6; do
    status=$(curl -s -o /dev/null -w '%{http_code}' --max-time 60 "$request" || true)
    [ "$status" = 400 ] && break
    sleep 10
  done
  echo "$status  ${request/token=x/token=…}"
  [ "$status" = 400 ] || { echo "Expected 400" >&2; exit 1; }
done

echo
echo "Deployed. THUMB_SERVICE_URL=$URL"
if [ "$MODE" = production ] && [ -n "$PREVIOUS" ]; then
  echo "Roll back: gcloud app services set-traffic $SERVICE --splits $PREVIOUS=1 --project $PROJECT --quiet"
fi
