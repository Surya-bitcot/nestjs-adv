import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv'
import { User } from "src/users/user.entity";
import { report } from "src/reports/report.entity";
dotenv.config()


export const dataSourceOptions : DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [User, report],
}


const datasource = new DataSource(dataSourceOptions);

export default datasource;