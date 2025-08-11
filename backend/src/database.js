import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "26.87.96.134",
  database: "BigDev_DB",
  password: "1234",
  port: 5432,
});

export default pool;
