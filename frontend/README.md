# Overview and description

A React based application for the Lesson Editor for LKK.

# Quick Start

Several quick start options are available:

* Download the latest version of Node package manager (npm). 
* Clone the repo: `git clone https://github.com/kodeklubben/lessoneditor.git`
* cd lessoneditor/frontend
* Install all dependencies with [npm](https://www.npmjs.com/) `npm install`
* Install all dependencies with [yarn](https://yarnpkg.com/) `yarn install`
* Start the application with `npm start` or `yarn start`

# Directory structure
```bash
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
```

# Running documentation locally

1. Run `npm install` to install the Node.js dependencies
2. Run `npm run test`
3. Run `npm start`
4. Open `http://localhost:3000/` in your browser

# Dependencies

* Node.js
* React.js
    * Redux.js
* highlight.js

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).