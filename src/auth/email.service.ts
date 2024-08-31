import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  sendChangePasswordEmail(
    email: string,
    username: string,
    resetPasswordtoken: string,
  ) {
    const resetLink = `https://dominio.com/reset-password?token=${resetPasswordtoken}`;

    this.mailerService.sendMail({
      to: email,
      subject: 'Recuperação de Senha - inProgress',
      template: 'forgotPassword',
      context: {
        username: username,
        resetLink: resetLink,
      },
    });
  }
}
