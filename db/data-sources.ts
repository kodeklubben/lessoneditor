import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  synchronize: process.env.POSTGRES_SYNCHRONIZE === "true",
  logging: false,
  entities: [String(process.env.POSTGRES_ENTITIES)],
  migrations: [String(process.env.POSTGRES_MIGRATIONS)],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
