import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const DBConnectionPool = mysql
  .createPool({
    port: 8306,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  })
  .promise();

export default DBConnectionPool;
