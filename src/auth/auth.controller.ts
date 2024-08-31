import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
  Res,
  Get,
  HttpCode,
  Put,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp-auth.dto';
import { LocalGuard } from './guards/local.guard';
import { Response } from 'express';
import { GoogleAuthGuard } from './guards/google.guard';
import { IRequestWIthUserInfo } from './types/IResquestWIthUserInfo';
import { timeConstants } from 'src/utils/timeConstants';
import { RequestPasswordChangeDto } from './dto/requestPasswordChange.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

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

  @Post('requestPasswordChange')
  @HttpCode(200)
  requestPasswordChange(
    @Body(new ValidationPipe())
    requestPasswordChangeDto: RequestPasswordChangeDto,
  ) {
    return this.authService.processPasswordResetRequest(
      requestPasswordChangeDto,
    );
  }

  @Put('changePassword')
  changePassoword(
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
    @Query('token') token,
  ) {
    return this.authService.changePassword({
      token,
      newPassword: changePasswordDto.newPassword,
    });
  }
}
