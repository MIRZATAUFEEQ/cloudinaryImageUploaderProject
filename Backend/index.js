import dotenv from 'dotenv';
import express from 'express';
import userRouter from './routes/user.routes.js';
import cors from 'cors';
import imageRouter from './routes/image.routes.js'
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware 😃😂🤣😀
//cors is using for cross origin ✅
// cors is using for connecting backend and frontend✅

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

//set the limit of image quality size by middleware✅
app.use(express.json({
    limit: '20mb',
}));

// Routes✅
app.use('/api/user', userRouter);
app.use('/api/admin', imageRouter);

app.get('/', (req, res) => {
    res.send('hello world')
})

// running server on port ✅
app.listen(port, () => {
    console.log(`⚙️  server is running at port http://localhost:${port}`)
})



