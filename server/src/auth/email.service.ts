import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { createTransport, getTestMessageUrl } from "nodemailer";

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  private SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
  private TOKEN_PATH = path.join(process.cwd(), 'token.json');
  private CREDENTIALS_PATH = path.join(process.cwd(), './mail/auth.json');
  private transporter;
  constructor() {
    // this.transporter = createTransport({
    //   host: "mail.digisense.es",
    //   port: 587,
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: "no-reply@digisense.es",
    //     pass: "_,nGTOrP,14", // replace with your actual password
    //   },
    //   tls: {
    //     rejectUnauthorized: false, // Allow self-signed certificates
    //   },
    //   logger: true, // Enable logging
    // });
    // this.transporter.verify();

  }

  async loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
    try {
      const content = await fs.readFile(this.TOKEN_PATH, 'utf-8');
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials) as OAuth2Client;
    } catch (err) {
      return null;
    }
  }

  async saveCredentials(client: OAuth2Client): Promise<void> {
    const content = await fs.readFile(this.CREDENTIALS_PATH, 'utf-8');
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(this.TOKEN_PATH, payload);
  }

  async authorize(): Promise<OAuth2Client> {
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = (await authenticate({
      scopes: this.SCOPES,
      keyfilePath: this.CREDENTIALS_PATH,
    })) as OAuth2Client;
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }
  // async sendEmail(to, subject, html){
  //     const mailOptions = {
  //         from: `"no-reply" <no-reply@digisense.es>`,
  //         to: `${to}`,
  //         subject: `${subject}`,
  //         html: `${html}`,
  //       };

  //       try {
  //         const info = await this.transporter.sendMail(mailOptions);
  //         console.log("Message sent: %s", info.messageId);
  //         console.log("Preview URL: %s", getTestMessageUrl(info));
  //       } catch (err) {
  //         console.error("Error while sending mail", err);
  //       }
  // }
  async sendEmail(auth: OAuth2Client, to, subject, html): Promise<void> {
    const gmail = google.gmail({ version: 'v1', auth });
    const email = [
      `From: "no-reply" <no--reply@digisense.es>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset="UTF-8"',
      '',
      `${html}`,
    ].join('\n');

    const encodedMessage = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    try {
      const res = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });
      console.log('Email sent:', res.data);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }


}