import express from 'express';
const ordersRouter = express.Router();
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

  ordersRouter.get("/", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders');
        res.json(result.rows)

    } catch(err){
        res.status(500).json(err)
    }
})

ordersRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM orders WHERE id=$1;', [id]);
        res.json(result.rows)

    } catch(err){
        res.status(500).json(err)
    }
})




  export default ordersRouter;