import express from 'express';
import pool from './pool.js';
const usersRouter = express.Router();
import {body, validationResult} from 'express-validator';




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
        res.status(404).json(err)
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
        res.status(404).json(err)
    }

})

usersRouter.delete("/:id", async (req, res) => {
    const {id} = req.params;
    
    try {
        const result = await pool.query('DELETE FROM users WHERE id=$1 ;', [id]);
        res.json(result.rows)

    } catch(err){
        res.status(404).json(err)
    }

})


//Return all orders of a user:

usersRouter.get("/:id/orders", async (req, res) => {
    const {id} = req.params;

    try{
        const result = await pool.query('SELECT users.*, orders.* FROM users, orders WHERE users.id = orders.user_id AND users.id=$1;', [id])
        res.json(result.rows)
    } catch(err) {
        res.status(404).json(err)
    }
})

//Set all user inactive that have not ordered yet:

usersRouter.put("/:id/check-inactive", async (req, res) => {
    const {id} = req.params;

    try {
        const hasOrderedCheck = await pool.query('SELECT COUNT(*) FROM orders WHERE user_id=$1;', [id])
        console.log(hasOrderedCheck.rows[0].count);
        
        if(hasOrderedCheck.rows[0].count > 0) {
            return res.status(200).json({message: 'User has ordered before'});
        } else {
            const result = await pool.query('UPDATE users SET active=$1 WHERE id=$2 RETURNING *;', ["false", id])
            return res.json(result.rows);
        }   

    } catch(err) {
        res.status(500).json(err)
    }
}) 


export default usersRouter;