const config = {
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "orm-user",
  "password": "testing",
  "database": "lesson-editor",
  "synchronize": false,
  "logging": false,
  "entities": [
    "apps/nestbackend/src/user/user.entity.ts",
    "apps/nestbackend/src/lesson/lesson.entity.ts",
    "apps/nestbackend/src/session/session.entity.ts"
  ],
  "migrations": ["db/migration/**/*.ts"],
  "cli": {
    "migrationsDir": "db/migration"
  }
}

export default config;