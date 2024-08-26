import { Request } from 'express';

export interface IRequestWIthUserInfo extends Request {
  user: {
    userId: string;
    username: string;
    access_token: string;
  };
}
