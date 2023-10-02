import express from 'express';
import pool from './pool.js';
const usersRouter = express.Router();
import {body, validationResult} from 'express-validator';


/*app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows)

    } catch(err){
        res.status(500).json(err)
    }
    
    /*pool.query('SELECT NOW()')
    .then(data => res.json(data.rows)) 
    .catch(err => res.status(500).json(err))
    
})
*/


//READ return all users:
usersRouter.get("/", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows)

    } catch(err){
        res.status(500).json(err)
    }
})

//READ return single user:
usersRouter.get("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id=$1;', [id]);
        
        if(result.rows.length === 0){
            res.status(404).json({error: 'User not found'});
        }
        res.json(result.rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})

//Validator for CREATE Operation
const userCreateValidator = [
    body('first_name').isString().notEmpty().isLength({min:1}),
    body('last_name').isString().exists().isLength({min:1}),
    body('age').isNumeric().exists().isLength({min:1})
]

//CREATE create a new user:
usersRouter.post("/", userCreateValidator, async (req, res) => {
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
//Validator for Update Operation
const userPutValidator = [
    body('first_name').isString().notEmpty().isLength({min:1}).optional(),
    body('last_name').isString().exists().isLength({min:1}).optional(),
    body('age').isNumeric().exists().isLength({min:1}).optional()
]
//UPDATE update a specific user
usersRouter.put("/:id", userPutValidator, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const id = req.params.id;
    const { first_name, last_name, age } = req.body;
    
    try {
        const result = await pool.query('UPDATE users SET first_name=$1, last_name=$2, age=$3 WHERE id=$4  RETURNING *;', [first_name, last_name, age, id]);
        if(result.rows.length === 0){
            res.status(404).json({error: 'User not found'});
        }
        res.json(result.rows)
    } catch(err){
        res.status(500).json(err)
    }
}
)

//Second version for Put to create new array of values to be able to change the input
/*usersRouter.put("/:id", async (req, res) => {
    const {first_name, last_name} = req.body;
    const {id} = req.params;

    let setClauses = [];
    let values = [];
    
    if (first_name !== undefined) {
        setClauses.push(`first_name = $${values.length + 1}`);
        values.push(first_name);
    }
    
    if (last_name !== undefined) {
        setClauses.push(`last_name = $${values.length + 1}`);
        values.push(last_name);
    }

    if (!setClauses.length) {
        return res.status(400).json({ message: "No fields provided to update" });
    }

    values.push(id);
    
    const query = `UPDATE users SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`;
    console.log(query, 'query')
    try {
        const {rows} = await pool.query(query, values);
        if (!rows.length) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(rows[0]);
    } catch(err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});*/

//DELETE delete a specific user:
usersRouter.delete("/:id", async (req, res) => {
    const {id} = req.params;
    
    try {
        const result = await pool.query('DELETE FROM users WHERE id=$1 RETURNING *;', [id]);
        if(result.rows.length === 0){
            res.status(404).json({error: 'User not found'});
        }
        res.json(result.rows)
    } catch(err){
        res.status(500).json(err)
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