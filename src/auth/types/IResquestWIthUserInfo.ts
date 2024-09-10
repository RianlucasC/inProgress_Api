import { Request } from 'express';

export interface IRequestWIthUserInfo extends Request {
  user: {
    sub: number;
    username: string;
    access_token: string;
  };
}
