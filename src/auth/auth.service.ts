import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/signUp-auth.dto';
import { AuthCredentials } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp({ username, email, password }: SignUpDto) {
    const isEmailInUse = await this.usersService.findOneByEmail(email);

    if (isEmailInUse) {
      throw new HttpException(
        'Este endereço de e-mail já está em uso. Por favor, use outro endereço de e-mail.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    this.usersService.create({
      username,
      email,
      password: hashedPassword,
    });
  }

  async validateUser({ email, password }: AuthCredentials) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return null;
    }

    delete user.password;

    return user;
  }
}
