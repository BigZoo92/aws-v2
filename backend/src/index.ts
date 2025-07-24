import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products';
import authRouter from './routes/auth';
import commentsRouter from './routes/comments';
import meRoutes from './routes/me';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (origin) {
        callback(null, origin);
      } else {
        callback(new Error('CORS origin non définie'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/comments', commentsRouter);
app.use(meRoutes);

app.get('/', (_, res) => res.send('API OK ✅'));

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});
