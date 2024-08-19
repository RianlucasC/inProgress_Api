import { Controller, Get, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  SignUp(@Body(new ValidationPipe()) SignUpDto: SignUpDto) {
    return this.authService.signUp(SignUpDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }
}
