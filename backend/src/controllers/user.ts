import { Request, Response } from 'express';
import { generateTokens, SALT_SIZE } from 'utils';
import User from '../models/user';
import ms from 'ms';
import { HttpStatuses } from 'types';
import bcrypt from 'bcrypt';
import { REFRESH_TOKEN_EXPIRY } from 'config';

export const register = async (req: Request, res: Response) => {
  try {
    const refreshTokenExpiry = REFRESH_TOKEN_EXPIRY;
    const { email, name, password } = req.body;
    const hash = await bcrypt.hash(password, SALT_SIZE);
    const createdUser = await User.create({
      name,
      email,
      password: hash,
    });

    const { accessToken, refreshToken } = generateTokens(createdUser._id);

    createdUser.tokens.push(refreshToken);
    await createdUser.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms((refreshTokenExpiry || '7d') as ms.StringValue),
      path: '/',
    });

    res.send({
      user: {
        name: createdUser.name,
        email: createdUser.email,
      },
      accessToken,
    });
  } catch (err) {
    res.status(HttpStatuses.InternalServerError).send({ message: `Ошибка при регистрации: ${err}` });
  }
};

export const login = async (req: Request<{}, {}, UserLoginBodyDto>, res: Response) => {
  try {
    const { email, password } = req.body;
    const refreshTokenExpiry = REFRESH_TOKEN_EXPIRY;

    const findedUser = await User.findUserByCredentials(email, password);

    const { accessToken, refreshToken } = generateTokens(findedUser._id);
    findedUser.tokens.push(refreshToken);
    await findedUser.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms((refreshTokenExpiry || '7d') as ms.StringValue),
      path: '/',
    });

    res.send({
      user: {
        name: findedUser.name,
        email: findedUser.email,
      },
      accessToken,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    res.status(HttpStatuses.NotFound).send({ message: 'Пользователь не был найден' });
  }
};

export const user = async (req: Request & RequestWithId, res: Response) => {
  const id = req.user?._id;
  const findedUser = await User.findById(id).select('+tokens');
  if (!findedUser) {
    return res.status(HttpStatuses.NotFound).send({ message: 'Пользователь не был найден' });
  }

  return res.send({
    user: {
      name: findedUser.name,
      email: findedUser.email,
    },
    succes: true,
  });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(HttpStatuses.Unauthorized).send({ message: 'Токен не найден!' });
  }

  // Удаляем рефреш токен
  const user = await User.updateOne(
    { tokens: refreshToken },
    {
      $pull: { tokens: refreshToken },
    },
  );

  if (user.matchedCount === 0) {
    return res.status(HttpStatuses.NotFound).send({ message: 'Пользователь не найден' });
  }

  res.clearCookie('refreshToken');

  return res.send({
    success: true,
  });
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshTokenExpiry = REFRESH_TOKEN_EXPIRY;
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(HttpStatuses.Unauthorized).send({ message: 'Пожалуйста, выполните вход' });
  }

  const user = await User.findOne({ tokens: refreshToken }).select('+tokens');

  if (!user) {
    return res.status(HttpStatuses.NotFound).send({ message: 'Пользователь не найден!' });
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

  user.tokens = user.tokens.filter((token) => token !== refreshToken);
  user.tokens.push(newRefreshToken);
  await user.save();

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: ms((refreshTokenExpiry || '7d') as ms.StringValue),
    path: '/',
  });

  return res.send({
    user: {
      name: user.name,
      email: user.email,
    },
    success: true,
    accessToken,
  });
};
