import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST || "127.0.0.1",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || "orm-user",
  database: process.env.POSTGRES_DB || "lesson-editor",
  password: process.env.POSTGRES_PASSWORD || "pai_kjelke_bever",
  synchronize: process.env.POSTGRES_SYNCHRONIZE === "true",
  logging: false,
  entities: [String(process.env.POSTGRES_ENTITIES || "dist/apps/backend/**/*.entity.js")],
  migrations: [String(process.env.POSTGRES_MIGRATIONS || "dist/apps/backend/db/migrations/*.js")],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
