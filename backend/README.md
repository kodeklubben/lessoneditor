# Overview and description

A Skeleton Express.js application for handling lesson data and GitHub interactions for the Lesson Editor for LKK.

Basic functionality:

Gets HTTP Requests from the Lesson Editor asking for or containing lesson data:

* Stores data in a MongoDB database on save calls.
* Gets data from the MongoDB databases on load calls.
* Stores images to servers static folder on image uploads.
* Generates directories and files, and issues git push requests on submit calls.

# Quick Start

* Download the latest version of Node package manager (npm). 
* Clone the repo: `git clone https://github.com/kodeklubben/lessoneditor.git`
* `cd backend`
* Install all dependencies with [npm](https://www.npmjs.com/) `npm install`
* Start the server with `npm start`

# Directory Structure

```bash
backend/
├───api
│   ├───models
│   │   └───lesson.js
│   └───routes
│       ├───images.js
│       └───lessons.js
├───static
│   └───images
├───utils
│   ├───handleGit.js
│   └───wrriteToFile.js
├───app.js
├───README.md
└───server.js
```

# TODO

There are several missing features in this application at the moment. In the following missing features and intended improvements are listed.

* Implement secure routes.
* Add missing routes, and delete unnecessary routes.
* Improve error handling.
* Implement input validation.
* Implement secure GitHub transactions.
* Implement fetching and storage of existing lessons stored at [https://github.com/kodeklubben/oppgaver](https://github.com/kodeklubben/oppgaver)
* Improve image storage.
* Improve Access-Control-Allow-Headers.
* Implement lesson name storage collision handling.

# Dependecies

* Node.js
* Express.js
    * body-parser
    * multer
* mongoose
* simple-git
* nodemon
