import express from 'express';
const usersRouter = express.Router();
import pg from 'pg';
import {body, validationResult} from 'express-validator';

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

//validator with express-validator
const userValidator = [
    body('first_name').isString().isLength({min:1}).optional(),
    body('last_name').isString().isLength({min:1}).optional(),
    body('age').isNumeric().isLength({min:1}).optional()
]

usersRouter.post("/", userValidator, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const { first_name, last_name, age } = req.body;
    try {
        const result = await pool.query('INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *;', [first_name, last_name, age]);
        res.json(result.rows)

    } catch(err){
        res.status(500).json(err)
    }

})

usersRouter.put("/:id", userValidator, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.Status(400).json({errors: errors.array()})
    }

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