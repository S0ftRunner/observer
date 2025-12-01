import express from 'express';
import cors from 'cors';
const app = express();

const PORT = process.env.PORT || 3000;

// отключаем корс
app.use(cors());

app.listen(PORT, () => {
  console.log('Сервер работает!');
});
