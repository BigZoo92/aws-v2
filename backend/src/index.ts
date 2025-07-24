import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products';
import authRouter from './routes/auth';
import commentsRouter from './routes/comments';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/comments', commentsRouter);


app.get('/', (_, res) => res.send('API OK ✅'));

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});
