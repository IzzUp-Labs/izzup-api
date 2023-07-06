import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";
import { google } from "googleapis";
import { Options } from 'nodemailer/lib/smtp-transport';
import { UserService } from "../user/user.service";
import { JobOfferService } from "../job-offer/job-offer.service";
import { JobRequestStatus } from "../../domain/utils/enums/job-request-status";
import { ExtraJobRequestService } from "../extra/extra-job-request.service";

@Injectable()
export class MailingService {

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    private readonly jobOfferService: JobOfferService,
    private readonly extraJobRequestService: ExtraJobRequestService
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

  public async sendProblemEmail(userId: number, requestId: number) {
    // Find user
    const user = await this.userService.findOne({ id: userId });

    console.log("USER ID for MALING : " + userId);
    console.log("REQUEST ID for MALING : " + requestId);

    await this.extraJobRequestService.update(requestId, {
      status: JobRequestStatus.REJECTED,
      verification_code: null,
    });



    await this.setTransport();
    this.mailerService
      .sendMail({
        transporterName: 'gmail',
        to: this.configService.get('EMAIL'), // list of receivers
        subject: 'Problème sur une fonctionnalité', // Subject line
        template: 'problem',
        context: {
          // Data to be sent to template engine
          requestId: requestId,
          user_lastname: user.last_name,
          user_firstname: user.first_name,
          user_email: user.email,
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
