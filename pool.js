import pg from 'pg';

const {Pool} = pg;

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  })
  //can also write: const pool = new Pool(), library recognizes .env content

  export default pool;