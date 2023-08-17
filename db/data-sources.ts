import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: "127.0.0.1",
  port: 5432,
  username: "orm-user",
  database: "lesson-editor",
  password: "pai_kjelke_bever",
  synchronize: false,
  logging: false,
  entities: ["dist/apps/backend/**/*.entity.js"],
  migrations: ["dist/apps/backend/db/migrations/*.js"],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
