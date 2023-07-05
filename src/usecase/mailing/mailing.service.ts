import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";
import { google } from "googleapis";
import { Options } from 'nodemailer/lib/smtp-transport';
import { UserService } from "../user/user.service";

@Injectable()
export class MailingService {

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.configService.get('verification-email.CLIENT_ID'),
      this.configService.get('verification-email.CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: this.configService.get('verification-email.REFRESH_TOKEN'),
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('EMAIL'),
        clientId: this.configService.get('CLIENT_ID'),
        clientSecret: this.configService.get('CLIENT_SECRET'),
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  public async sendVerificationEmail(userId: number) {
    // Create a verification code with 5 digits and save it in user's table
    const code = Math.floor(10000 + Math.random() * 90000);
    await this.userService.update(userId, {
      email_confirmation_code: code,
    })

    // Find user
    const user = await this.userService.findOne({ id: userId });

    await this.setTransport();
    this.mailerService
      .sendMail({
        transporterName: 'gmail',
        to: user.email, // list of receivers
        subject: 'Verification Code', // Subject line
        template: 'action',
        context: {
          // Data to be sent to template engine
          code: code,
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public async checkVerificationCode(userId: number, code: number) {
    const user = await this.userService.findOne({ id: userId });
    if (user.email_confirmation_code === code) {
      await this.userService.update(userId, {
        email_confirmation_code: null,
        is_email_confirmed: true,
      });
      return true;
    } else {
      return false;
    }
  }

  public async changeEmailToSendCode(userId: number, email: string) {
    await this.userService.update(userId, {
      email: email,
    });
    await this.sendVerificationEmail(userId);
  }
}
