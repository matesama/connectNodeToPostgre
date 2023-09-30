import express from 'express';
import usersRouter from './users.js';
import 'dotenv/config';
import ordersRouter from './orders.js';
const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
 
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






const port = process.env.Port || 8000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})