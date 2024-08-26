export class CreateUserDto {
  username: string;
  email: string;
  password?: string;
  avatar_url?: string;
  auth_provider?: 'LOCAL' | 'GOOGLE';
}
