import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({ email, password });

    if (!user) {
      throw new HttpException(
        'email ou/e senha errados',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { sub: user.id, username: user.username };
    return {
      userId: user.id,
      username: user.username,
      access_token: this.jwtService.sign(payload),
    };
  }
}
