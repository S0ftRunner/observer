import express from 'express';
import cors from 'cors';
import path from 'path';
import logRouter from './routes/logs';
import { connnectToMongo } from './config';

const app = express();
const PORT = process.env.PORT || 3000;

connnectToMongo();

// отключаем корс
app.use(
  cors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// нужно для хранения файлов в public
app.use(express.static(path.join(__dirname, 'public')));

// для корректной работы с JSON
app.use(express.json());

// для корректной кодировки
app.use(express.urlencoded({ extended: true }));

app.use('/logs', logRouter);

app.listen(PORT, () => {
  console.log(`Сервер поднят на порту: ${PORT}`);
});
