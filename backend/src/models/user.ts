import mongoose, { HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser {
  name: string;
  email: string;
  password: string;
  tokens: Array<string>;
}
interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<HydratedDocument<IUser>>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  tokens: {
    type: [String],
    default: [],
    select: false,
  },
});

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user = await this.findOne({ email }).select('+password').select('+tokens');

  if (!user) {
    return Promise.reject(new Error('Пользователь не найден'));
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    return Promise.reject(new Error('Пользователь не найден'));
  }

  return user;
});

export default mongoose.model<IUser, UserModel>('User', userSchema);
