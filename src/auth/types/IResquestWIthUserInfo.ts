import { Request } from 'express';

export interface IRequestWIthUserInfo extends Request {
  user: {
    userId: number;
    username: string;
    access_token: string;
  };
}
