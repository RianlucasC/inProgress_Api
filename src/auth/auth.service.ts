import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/signUp-auth.dto';
import { AuthCredentials } from './auth.types';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { RequestPasswordChangeDto } from './dto/requestPasswordChange.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

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

    if (user.auth_provider !== 'GOOGLE' && user.password === null) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return null;
      }
    }

    return user;
  }

  async processPasswordResetRequest({ email }: RequestPasswordChangeDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new HttpException(
        'O e-mail informado não está associado a nenhum usuário.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const payload = { sub: user.id };
    const resetPasswordtoken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    this.emailService.sendChangePasswordEmail(
      email,
      user.username,
      resetPasswordtoken,
    );
  }

  async changePassword({
    token,
    newPassword,
  }: {
    token: string;
    newPassword: string;
  }) {
    try {
      const { sub: userId } = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const newPasswordHashed = await bcrypt.hash(newPassword, 10);

      this.usersService.update(userId, {
        password: newPasswordHashed,
      });
    } catch (error) {
      throw new HttpException(
        'token inválido ou expirado',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
