import express from 'express';
const usersRouter = express.Router();
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



usersRouter.get("/", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows)

    } catch(err){
        res.status(500).json(err)
    }
})

usersRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id=$1;', [id]);
        res.json(result.rows)

    } catch(err){
        res.status(500).json(err)
    }
})

usersRouter.post("/", async (req, res) => {
    const { first_name, last_name, age } = req.body;
    try {
        const result = await pool.query('INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *;', [first_name, last_name, age]);
        res.json(result.rows)

    } catch(err){
        res.status(500).json(err)
    }

})

usersRouter.put("/:id", async (req, res) => {
    const id = req.params.id;
    const { first_name, last_name, age } = req.body;
    try {
        const result = await pool.query('UPDATE users SET first_name=$1, last_name=$2, age=$3 WHERE id=$4  RETURNING *;', [first_name, last_name, age, id]);
        res.json(result.rows)

    } catch(err){
        res.status(500).json(err)
    }

})

usersRouter.delete("/:id", async (req, res) => {
    const {id} = req.params;
    
    try {
        const result = await pool.query('DELETE FROM users WHERE id=$1 ;', [id]);
        res.json(result.rows)

    } catch(err){
        res.status(500).json(err)
    }

})


export default usersRouter;