import { IsEmail, Matches } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Por favor, insira um endereço de e-mail válido.' })
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
    },
  )
  password: string;
}
