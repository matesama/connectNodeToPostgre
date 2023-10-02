import express from 'express';
import usersRouter from './routes/users.js';
import 'dotenv/config';
import ordersRouter from './routes/orders.js';

const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
 
const port = process.env.Port || 8000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})