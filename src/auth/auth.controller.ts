import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp-auth.dto';
import { LocalGuard } from './guards/local.guard';
import { Response } from 'express';
import { GoogleAuthGuard } from './guards/google.guard';
import { IRequestWIthUserInfo } from './types/IResquestWIthUserInfo';
import { timeConstants } from 'src/utils/timeConstants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  SignUp(@Body(new ValidationPipe()) signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signIn')
  @UseGuards(LocalGuard)
  async SignIn(
    @Req() req: IRequestWIthUserInfo,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.user.access_token;
    res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: timeConstants.oneDayInMilliseconds,
    });
  }

  @Get('google/signIn')
  @UseGuards(GoogleAuthGuard)
  googleSignIn() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleRedirect(
    @Req() req: IRequestWIthUserInfo,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.user.access_token;
    res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: timeConstants.oneDayInMilliseconds,
    });
  }
}
