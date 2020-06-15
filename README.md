# Overview and description
The aim of this project was to create web application possibility for a teacher to make   new  lessons  for  LKK’swebsite,kidsakoder.no, without difficulty.
Our minimal requirement is to have a basic functioning application where the teacher don’t have to have any knowledge with Git when they want to edit or create anexercise for LKK’s website.

# Quick start
Several quick start options are available:

* Download the latest version of Node package manager (npm). 
* Clone the repo: `git clone https://github.com/kodeklubben/lessoneditor.git`

Frontend: 
* cd lessoneditor/frontend
* Install all dependencies with [npm](https://www.npmjs.com/) `npm install`
* Install all dependencies with [yarn](https://yarnpkg.com/) `yarn install`
* Start the application with `npm start` or `yarn start`

Backend:
* cd lessoneditor/backend
* Install all dependencies with [npm](https://www.npmjs.com/) `npm install`
* Start the server with `npm start`

# What's included
Within the download you'll find the following directories and files. By default node_modules folder will be added when you run `npm install`. You'll see something like this:


```bash
frontend/
├───public
├───src
│   ├───actions
│   ├───api
│   ├───components
│   │   ├───frontPageComponents
│   │   ├───lessonForm
│   │   │   └───settingsFiles
│   │   │       └───languages
│   │   ├───mdPreviewComponents
│   │   │   └───settingsFiles
│   │   ├───mdTextEditor
│   │   │   ├───editor
│   │   │   │   └───controlpanel
│   │   │   │       └───components
│   │   │   ├───mdPreview
│   │   │   └───settingsFiles
│   │   │       └───languages
│   │   ├───mypage
│   │   └───YAMLComponents
│   │       └───settingsFiles
│   ├───reducers
│   └───utils
│       └───markdown-it-plugins
└───test

backend/
├───api
│   └───routes
│       ├───images.js
│       └───lessons.js
├───static
│   └───images
├───utils
│   └───wrriteToFile.js
├───app.js
├───README.md
└───server.js
```

# Running documentation locally
Frontend:
1. `cd frontend`
2. Run `npm install` to install the Node.js dependencies
3. Run `npm run test`
4. Run `npm start`
5. Open `http://localhost:3000/` in your browser,

Backend:
1. `cd backend`
2. Run `npm install` to install the Node.js dependencies
3. Run `npm start`
4. Open `http://localhost:5000` in your browser

# Project structure
Our project build is based on two parts, a client part and a server part. The server part contains all the necessary REST API implementations needed for handling data from the frontend and the client part contains the frontend "user-based" actions like creat new lesson, browse the user's created lesson and edit existing lesson.

## Node js + express (backend)
An Express application is most often used as backend application in a client-server architecture whereas the client could
be written in React.js, the server could be written in Express. We used express as our server.
Express ensured that all middleware can respond to HTTP requests and routing tables were setup to respond to different actions
based on the HTTP method.

We used mongodb as our db. Mongodb is a schemaless database that is easy to setup and use, and is famous for scaling really well,
perfect for an app that should be able to handle large amounts of data. To interface with mongodb we chose
to use mongoose, which provides a lot of nice functionality such as validation functions. With this setup, we define our database
model in mongoose schemas, and then we can easily do CRUD operations with mongoose methods.

## Redux
Redux is a Javascript Library for managing application state. Redux provides a real time current state of the lesson with all the
state variables that the app has at a given time. This helps keep control of how the lesson state changes overtime and it is also very useful when debugging.


## markdown-it
markdown-it is a markdown parser package for node used for parsing markdown plaintext to html in the real-time previewer.
The package is fast and easy to extend to suite specific needs through the plugin feature.

For more information on markdown-it see: [https://www.npmjs.com/package/markdown-it](https://www.npmjs.com/package/markdown-it).

Plugins:

All self developed plugins are located at: `frontend/src/utils/markdown-it-plugins/`

* markdown-it-attrs: A plugin adding class identifiers and attributes to the parsed markdown by using the syntax: `{.class #identifier attr=value attr2="spaced value}`
For more information on markdown-it-attrs see: [https://www.npmjs.com/package/markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs).

* markdown-it-checklist: A plugin transforming a standard markdown list of the syntax; `- [ ], - [X] or - [ x]`, to a html checklist.
The plugin is based on markdown-it-task-list by revin: ([https://github.com/revin/markdown-it-task-lists](https://github.com/revin/markdown-it-task-lists)).

*  markdown-it-header-sections: A plugin wrapping html code in a new section when a markdown-header is combined with a class identifier; `# header1 {.class}`.
The plugin is based on markdown-it-header-section by arve0: [https://github.com/arve0/markdown-it-header-sections](https://github.com/arve0/markdown-it-header-sections).

* markdown-it-insert-img: A plugin for parsing markdown links to html `<img>`-elements displaying the image form a specific URL.

## Prop types 
In addition we implemented the use of proptypes in our react component structures which is a form of validation that ensures
the right type of props are always passed to a react component. It is not really a form of testing, but it helps maintain
correctness in the app.





This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

### Frontend
In the projects frontend directory, you can run:

#### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


### Backend

In the projects backend directory, you can run:

#### `npm start`

Runs the express application.
Currently set up to run through `nodemon` for ease of development.
Send HTTP request to [http://localhost:5000/$route](http://localhost:5000/lessons) to access the server.


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

