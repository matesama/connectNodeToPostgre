import express from 'express';
import pool from './pool.js';
const ordersRouter = express.Router();
import {body, validationResult} from 'express-validator';


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

//order validation:
const orderValidator = [
    body('price').isNumeric().isLength({min: 1}).optional(),
    body('date').isString().isLength({min: 1}).optional()
];

ordersRouter.post("/", orderValidator, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    
    const { price, date, user_id } = req.body;
    try {
        const result = await pool.query('INSERT INTO orders (price, date, user_id) VALUES ($1, $2, $3) RETURNING *;', [price, date, user_id]);
        res.json(result.rows)

    } catch(err){
        res.status(500).json(err)
    }

})

ordersRouter.put("/:id", orderValidator, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    
    
    const id = req.params.id;
    const { price, date, user_id } = req.body;
    try {
        const result = await pool.query('UPDATE orders SET price=$1, date=$2, user_id=$3  WHERE id=$4  RETURNING *;', [price, date, user_id, id]);
        res.json(result.rows)

    } catch(err){
        res.status(500).json(err)
    }

})

ordersRouter.delete("/:id", async (req, res) => {
    const {id} = req.params;
    
    try {
        const result = await pool.query('DELETE FROM orders WHERE id=$1;', [id]);
        res.json(result.rows)

    } catch(err){
        res.status(500).json(err)
    }

})

ordersRouter.delete("/:user_id", async (req, res) => {//To delete a user that already has orders, first delete orders and then user
    const {user_id} = req.params;
    
    try {
        const result = await pool.query('DELETE FROM orders WHERE user_id=$1;', [id]);
        res.json(result.rows)

    } catch(err){
        res.status(500).json(err)
    }

})

  export default ordersRouter;