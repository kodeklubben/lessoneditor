# Overview and description
The aim of this project was to create web application possibility for a teacher to make   new  lessons  for  LKK’swebsite,kidsakoder.no, without difficulty.
Our minimal requirement is to have a basic functioning application where the teacher don’t have to have any knowledge with Git when they want to edit or create anexercise for LKK’s website.

# Quick start
Several quick start options are available:

* Download the latest version of Node package manager (npm). 
* Clone the repo: `git clone https://github.com/kodeklubben/lessoneditor.git`
* Install all dependencies with [npm](https://www.npmjs.com/) `npm install`
* Install all dependencies with [yarn](https://yarnpkg.com/) `yarn install`
* Start the application with `npm start` or `yarn start`


# What's included
Within the download you'll find the following directories and files. By default node_modules folder will be added when you run `npm install`. You'll see something like this:

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
4. Open `http://localhost:3000/` in your browser,





This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
