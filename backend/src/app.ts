import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`Сервер поднят на порту: ${PORT}`);
});
