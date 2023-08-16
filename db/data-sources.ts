import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "orm-user",
  database: "lesson-editor",
  password: "testing",
  synchronize: false,
  logging: false,
  entities: ["dist/apps/nestbackend/**/*.entity.js"],
  migrations: ["dist/apps/nestbackend/db/migrations/*.js"],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
