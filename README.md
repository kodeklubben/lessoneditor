# Lesson Editor: Web Application for LKK

## Project Overview

The goal of this project is to create a web application that enables teachers to effortlessly create and edit lessons for the Lær Kidsa Koding (LKK) website, kidsakoder.no. Our minimal requirement is a basic, functioning application that doesn't require teachers to have any knowledge of Git when editing or creating exercises for the LKK website.

## Getting Started

1. Install Node Version Manager from [here](https://github.com/nvm-sh/nvm).

2. In your project's root directory, run `nvm use` to install the correct Node version for this project (Current project is dependent on NodeJS v16).

3. Run `npm install` to install all necessary dependencies.

4. [Set up your Development Environment](#setup-dev-environment).

5. Install and run [Docker-Desktop](https://www.docker.com/products/docker-desktop/).

6. Execute `docker-compose up --build` to run database containers.

7. Run `npm run build-all` to build frontend, contracts and thumbnailer in to the dist-folder.

8. Build the backend with `npm run build-nestbackend`.

9. Start the backend with `npm run start-nestbackend`.

10. Start the frontend and thumbnailer with `npm start`.

11. Open [http://localhost:4200/](http://localhost:4200) in your browser! Happy coding!

## Project Structure

The project is divided into three parts: the client, thumbnailer function, and server. The server handles REST API implementations needed for frontend data handling. The client includes frontend user actions such as creating new lessons, browsing user-created lessons, and editing existing lessons. The thumbnailer snaps screenshots of lessons using Puppeteer.

## Frontend

The frontend is written in ReactJS and uses Semantic UI React for theming. We also utilize markdown-it for parsing markdown plaintext to HTML in real-time.

## Thumbnailer (The Lessoneditor Thumbnail Service)

Thumbnailer is a utility service that captures screenshots of lessons every time a lesson is saved. It uses Puppeteer to accomplish this.

## Nestbackend

Nestbackend manages server services, database management, and communication with Github.

### Setup Dev Environment:

1. Create new OAuth app on Github [here](https://github.com/settings/developers)
2. Create a `.env` file in the root directory.
3. Populate the `.env` file with environment variables as shown below:

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
DB_SYNCHRONIZE=false
DB_LOGGING=true
DB_ENTITIES=app/nestbackend/src/*/*.entity.ts
```

## Database

- Install Docker
- Run `docker-compose up --build` in the root directory to start the database
