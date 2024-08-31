import { IsEmail } from 'class-validator';

export class RequestPasswordChangeDto {
  @IsEmail({}, { message: 'e-mail inválido.' })
  email: string;
}
