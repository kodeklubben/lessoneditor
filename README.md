# Lesson Editor for LKK 🚀

Create and edit lessons for the [Lær Kidsa Koding (LKK)](https://kidsakoder.no) website without any Git hassles!

## 📌 Features

- **Frontend**: Developed using ReactJS with Semantic UI React theming.
- **Backend**: Manages server services, database, and GitHub communication.
- **Thumbnailer**: Captures screenshots of lessons when saved using Puppeteer.

## 🚀 Quick Start

1. **Prerequisites**: Install [Node Version Manager](https://github.com/nvm-sh/nvm) and [Docker-Desktop](https://www.docker.com/products/docker-desktop/).
2. **Development Setup**: Before accessing the application, ensure you've followed the [Development Setup](#-development-setup) to configure your environment properly.
3. **Node Version**: Ensure NodeJS is installed using `nvm use` (correct version in ./.nvmrc).
4. **Setup**: Install the required dependencies using `npm install`.
5. **Database**: Set up the database by executing `docker-compose up --build`.
   - If running the DB for the first time, set up tables using `npm run migration:run`.
6. **Build**:
   - Frontend, contracts, and thumbnailer: `npm run build-all`.
   - Backend: `npm run build-backend`.
7. **Run**:
   - Backend: `npm run start-backend`.
   - Frontend & Thumbnailer: `npm start`.
8. 🌍 **Access**: Open [http://localhost:4200/](http://localhost:4200) and start editing!

## 🛠 Development Setup

1. Create a new OAuth app on [GitHub](https://github.com/settings/developers).
2. Create a `.env` file in the project's root and populate with necessary values:

   ```bash
   GH_CLIENT_ID=<Your_GitHub_Client_ID>
   GH_CLIENT_SECRET=<Your_GitHub_Client_Secret>
   GH_CALLBACK_URL=<Your_Callback_URL> (e.g., http://localhost:4200/api/auth/callback)
   THUMB_SERVICE_URL=<Your_Thumbnail_Service_URL> (e.g., http://localhost:3012)
   GH_LESSON_REPO_OWNER=<"Oppgaver"-Repo_owner> (this should be "kodeklubben" in production, but you can use your github name if you have made a fork of https://github.com/kodeklubben/oppgaver and want to test submitting to it instead.)
   GH_LESSON_REPO=oppgaver (name of oppgaver repo)

   COOKIE_SECRET=<Your_Cookie_Secret> (e.g. "s3cr3ts")
   SESSION_SECRET=<Your_Session_Secret> (e.g. "s3cr3ts")

   DISABLE_PULLREQUESTS=true/false // Use 'true' to disable pull requests for submitted lessons during testing

   POSTGRES_USER=<Your_Postgres_Username>
   POSTGRES_PASSWORD=<Your_Postgres_Password>
   POSTGRES_DB=<Your_Postgres_DB_Name>
   ```

## 📦 Dependencies Overview

- **Main Framework**: The project is built with `React` and `NestJS`.
- **Database**: We use `TypeORMM` with a PostgreSQL database.
- **UI Library**: The frontend UI is enhanced using `Semantic UI React`.
- **Utility Services**: For screenshots, we use `Puppeteer`.

You can refer to the `package.json` file for the complete list and versions of dependencies and scripts.

## 🤝 Contribution

Feel free to submit pull requests, create issues, and enhance the application. Every contribution is valued!

## 🔐 License

This project is licensed under the MIT License.
