import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGODB_URL = process.env.MONGO_URL;
export const ACCESS_TOKEN_EXPIRY = process.env.AUTH_ACCESS_TOKEN_EXPIRY || '1m';
export const REFRESH_TOKEN_EXPIRY = process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d';
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const ZEEK_URL = process.env.ZEEK_URL || '';

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
