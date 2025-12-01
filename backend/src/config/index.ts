import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGODB_URL = process.env.MONGO_URL;

export async function connnectToMongo() {
  await mongoose
    .connect(`mongodb://${MONGODB_URL}`)
    .then(() => {
      console.log('Успешное подключение к MongoDB');
    })
    .catch((err) => {
      console.log(`Не удалось подключиться к MongoDB: ${err}`);
    });
}
