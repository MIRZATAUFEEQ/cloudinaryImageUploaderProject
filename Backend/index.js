import dotenv from 'dotenv';
import express from 'express';
import userRouter from './routes/user.routes.js';
import cors from 'cors';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

app.use(express.json({
    limit: '20mb',
}));

// Routes
app.use('/api/user', userRouter);


app.get('/', (req, res) => {
    res.send('hello world')
})


app.listen(port, () => {
    console.log(`server is running at port http://localhost:${port}`)
})



