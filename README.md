# Overview and description

The aim of this project was to create web application possibility for a teacher to make new lessons for LKK’s website, kidsakoder.no, without difficulty.
Our minimal requirement is to have a basic functioning application where the teacher don’t need to have any knowledge with Git when they want to edit or create an exercise for Lær Kidsa Koding website.

## Quick start

- Install Node Version Manager: https://github.com/nvm-sh/nvm

- Run `nvm use` in root directory to install the correct Node-version for this project (version number in .nvnmrc - file)

- Run `npm install` to install all dependencies

- Install Database as described below.

- Set up Dev Environment as described below.

- Run `npm run build-all` to build dist-folder

- Run `npm run build-nestbackend` to build backend. Before ..:

- Run `npm run start-nestbackend` to start backend

- Run `npm start" to start fronend

- Open `http://localhost:4200/` in your browser! Happy coding!

- ProTIP: Download pgAdmin: https://www.pgadmin.org/ - to manage Database!

### Frontend:

- Install all dependencies with [npm](https://www.npmjs.com/) `npm install`
- Start the application with `npm start frontend`
- Open `http://localhost:4200/` in your browser

### Thumbnailer (The Lessoneditor Thumbnail Service):

- Install all dependencies with [npm](https://www.npmjs.com/) `npm install`
- Start thumbnail serice with `npm start thumbnailer`
- Open `http://localhost:3012` in your browser

### Nestbackend:

- Nestbackend is using typeorm which is not compatible with webpack build the nestbacken using `npm run build-nestbackend`
  and server the backend using `npm run start-nestbackend`

### Setup Dev Environment:

- Create new oAuth app at Github (`https://github.com/settings/developers`)
- Create env-file at `/.local.env`
- Populate the env-file with env variables:

```
GITHUB_CLIENT_ID= your client ID
GITHUB_CLIENT_SECRET= your client secret
GITHUB_CALLBACK_URL= your callback url. ex: http://localhost:4200/api/auth/callback
THUMB_SERVICE_URL= your thumbnailer url. ex: http://localhost:3012
GITHUB_LESSON_REPO_OWNER= your gitname
GITHUB_LESSON_REPO= your lesson_repo name ex "oppgaver"

TYPEORM_CONNECTION=postgres
TYPEORM_HOST=localhost
TYPEORM_USERNAME=orm-user
TYPEORM_PASSWORD=testing
TYPEORM_DATABASE=lesson-editor
TYPEORM_PORT=5432
TYPEORM_SYNCHRONIZE=false
TYPEORM_ENTITIES= dist/\*_/_.entity.js
```

#### Database

- install docker
- create folder for db files, ex Windows: mkdir %userprofile%\data\pg-node-orms
- start postgres docker container "docker run --name pg-node-orms -p 5432:5432 -e POSTGRES_PASSWORD=testing -e POSTGRES_USER=orm-user -e POSTGRES_DB=lesson-editor -v %userprofile%\data\pg-node-orms:/var/lib/postgresql/data -d postgres"

- to generate migration file from schema changes run (in project root) ex: "npx ts-node -P tsconfig.node.json ./node_modules/typeorm/cli.js --config ormconfig.migration.ts migration:generate -n MIGRATION_NAME" ( where MIGRATION_NAME is replaced by a migration name you chose)

- to run the migration run (in project root) ex: "npx ts-node -P tsconfig.node.json ./node_modules/typeorm/cli.js --config ormconfig.migration.ts migration:run"

## Project structure

Our project structure is divided in two parts, a client part and a server part. The server part contains all the necessary REST API implementations needed for handling data from frontend. Client part contains frontend "user-based" actions like create a new lesson, browse the user's created lessons and edit existing lessons.

## Frontend

#### React js

React is an open-source front-end JavaScript library for building user interfaces or UI components. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications.

https://reactjs.org/

#### Semantic UI React

Semantic UI is a front-end development framework similar to bootstrap designed for theming. It contains pre-built semantic components that helps create beautiful and responsive layouts using human-friendly HTML.

https://react.semantic-ui.com/

#### markdown-it

Markdown-it is a markdown parser package for node used for parsing markdown plaintext to html in the real-time previewer.
The package is fast and easy to extend and suites specific needs through the plugin feature.

For more information on markdown-it see: [https://www.npmjs.com/package/markdown-it](https://www.npmjs.com/package/markdown-it).

Plugins:

All self developed plugins are located at: `frontend/src/utils/markdown-it-plugins/`

- markdown-it-attrs: A plugin adding class identifiers and attributes to the parsed markdown by using the syntax: `{.class #identifier attr=value attr2="spaced value}`
  For more information on markdown-it-attrs see: [https://www.npmjs.com/package/markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs).

- markdown-it-checklist: A plugin transforming a standard markdown list of the syntax; `- [ ], - [X] or - [ x]`, to a html checklist.
  The plugin is based on markdown-it-task-list by revin: ([https://github.com/revin/markdown-it-task-lists](https://github.com/revin/markdown-it-task-lists)).

- markdown-it-header-sections: A plugin wrapping html code in a new section when a markdown-header is combined with a class identifier; `# header1 {.class}`.
  The plugin is based on markdown-it-header-section by arve0: [https://github.com/arve0/markdown-it-header-sections](https://github.com/arve0/markdown-it-header-sections).

- markdown-it-insert-img: A plugin for parsing markdown links to html `<img>`-elements displaying the image form a specific URL.

#### Prop types

We have also implemented proptypes in our react component structures which is a form of validation. It will help us to ensure
the right type of props passed to our react components. It is not really a form of testing, but it helps maintain
correctness in the app.

## Backend

#### NESTjs

The backend is written in the NESTjs framework. The user is authenticate with their github account and is served the react page on successful authentication. A cookie is set in the browser to provide authentication for the api endpoints. A token is issued from the server to enable to app to make a call to the react application wihtout a user to obtain the thumbnail image for the lessons. When the user is logged out the session is cleared and the users is redirected to a logout page.

The NESTjs app uses typeorm t communicate with the postgres database
