import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv'
import { User } from "src/users/user.entity";
import { Bus } from "src/buses/buses.entity";
import { Route } from "src/routes/routes.entity";
import { Booking } from "src/bookings/bookings.entity";

dotenv.config()

export const dataSourceOptions : DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'bus_booking',
  // synchronize: process.env.NODE_ENV !== 'production', // Disable in production
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Bus, Route, Booking],
  migrations: ['dist/migrations/*.js'],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
}

const datasource = new DataSource(dataSourceOptions);

export default datasource;