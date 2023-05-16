module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "orm-user",
  database: "lesson-editor",
  password: "testing",
  synchronize: false,
  logging: false,
  entities: [
    "apps/nestbackend/src/user/user.entity.ts",
    "apps/nestbackend/src/lesson/lesson.entity.ts",
    "apps/nestbackend/src/session/session.entity.ts",
  ],
  migrations: [],
};
