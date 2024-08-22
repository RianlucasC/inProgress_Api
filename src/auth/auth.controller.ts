import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp-auth.dto';
import { LocalGuard } from './guards/local.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  SignUp(@Body(new ValidationPipe()) signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signIn')
  @UseGuards(LocalGuard)
  async SignIn(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    console.log('teste');
    const user = req.user as {
      userId: string;
      username: string;
      access_token: string;
    };

    const token = user.access_token;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: oneDayInMilliseconds,
    });
  }
}
