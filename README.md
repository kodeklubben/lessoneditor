# Lesson Editor for Lær Kidsa Koding

Create and edit lessons for [Lær Kidsa Koding](https://kidsakoder.no) with a React editor, a NestJS API, PostgreSQL and a Puppeteer thumbnail service.

## Run locally

Prerequisites: **Node.js 24 LTS**, npm 11 or 12, and Docker with Compose v2.

```sh
nvm use
npm ci
npm run browser:install
cp .env.example .env  # Only on first setup; keep an existing .env.
```

Create a [GitHub OAuth app](https://github.com/settings/developers) with homepage `http://localhost:4200` and callback **`http://localhost:4200/api/auth/callback`**. Set its client ID and secret in `.env`. Generate separate random `COOKIE_SECRET` and `SESSION_SECRET` values as described there. Never commit credentials.

```sh
npm run db:up
npm run migration:run
npm run dev
```

Open **http://localhost:4200** and sign in with GitHub. The API runs on port 8080 and thumbnails on port 3012. PostgreSQL binds only to loopback, on **55432**, so it can coexist with other projects using 5432. Change `POSTGRES_PORT` if needed.

`npm run dev` builds the backend and thumbnail service before starting them. Backend and frontend changes reload automatically. For thumbnail source changes, rebuild with `npm run build:thumbnailer` and restart development services.

All packages, including `apps/thumbnailer`, use the root npm workspace and **one `package-lock.json`**. Run `npm ci` from the repository root. `npm run browser:install` installs Puppeteer's matching Chrome explicitly, including with npm 12 where dependency install scripts can be blocked.

`DISABLE_PULL_REQUESTS=true` disables the entire GitHub submission flow, including forks and commits. Creating, editing and saving local lessons still works. Only set it to `false` when you intend to publish to GitHub.

Stop the servers with Ctrl+C and stop PostgreSQL with `npm run db:down`. The `lessoneditor-local_postgres_data` volume persists. Do not remove that volume unless you intend to delete the local database.

## Checks

```sh
npm run check          # lint, TypeScript, unit tests and production builds
npm run test:smoke     # after db:up and migration:run
npm audit --omit=dev
```

The smoke test starts temporary services on ports 44100 and 44112. It uses synthetic users and sessions in the local database, checks authorization, CRUD, editor autosave, thumbnails and logout, and removes its fixtures. It does not perform a real GitHub OAuth exchange or publish anything. Screenshots are written to ignored `test-results/`.

CI runs these checks on pull requests and pushes to `main`, using a separate PostgreSQL service and placeholder OAuth credentials. A green build does not prove the production OAuth configuration or GitHub submission permissions.

## Runtime and compatibility

The project uses Node 24, Nx 23 and NestJS 12. React stays on 18.3 because Semantic UI React does not support React 19. TypeORM stays on the tested 0.3 line to preserve the existing database contract. Babel 7 and TypeScript 5.9 match the build tooling; this is a compatible upgrade rather than a forced update of every major version.

The Webpack configuration uses the current `NxAppWebpackPlugin`; the backend uses one TypeScript compilation path so migrations and runtime files are always built together. Sessions persist in the existing PostgreSQL session table. No production schema migration was added for this upgrade.

The `overrides` in `package.json` patch transitive `undici` and `uuid` dependencies. The development toolchain still reports the upstream, currently unpatched `braces` advisory through file matching and Webpack's dev server. The dev server binds to localhost. Recheck `npm audit` when updating packages; do not use `npm audit fix --force` blindly.

## Deployment

Pushing or merging to `main` runs CI. **Production deployment is manual**, through the “Deploy to production (manual)” workflow. It reruns CI, migrates the database, then deploys App Engine. See [deployment setup](docs/deploy.md) and the [thumbnail service](apps/thumbnailer/README.md) before the first deployment of this version.

## License

MIT.
