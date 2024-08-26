import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    super({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.REDIRECT_URL,
      scope: ['profile', 'email'],
      session: false,
    });
  }

  async validate(acessToken: string, refreshToken: string, profile: Profile) {
    let user = await this.usersService.findOneByEmail(profile.emails[0].value);

    if (!user) {
      user = await this.usersService.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        avatar_url: profile.photos[0].value,
        auth_provider: 'GOOGLE',
      });
    }

    const payload = { sub: user.id, username: user.username };
    return {
      userId: user.id,
      username: user.username,
      access_token: this.jwtService.sign(payload),
    };
  }
}
