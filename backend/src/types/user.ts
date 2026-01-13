export type UserLoginDto = {
  login: string;
  password: string;
};

export type RequestWithId = {
  user: {
    _id: string;
  };
};
