import nodemailer from "nodemailer";
import { envs } from "../../config/plugins/env.plugins";
import { LogRepository } from "../../domain/repository/log.repository";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

interface sendMailOption {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachments[];
}

interface Attachments {
  filename: string;
  path: string;
}

export class EmailService {

  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  async sendEmail(options: sendMailOption): Promise<boolean> {
    const { to, subject, htmlBody, attachments = [] } = options;

    try {
      const sendInformation = await this.transporter.sendMail({
        to,
        subject,
        html: htmlBody,
        attachments,
      });

      console.log("👉 ~ sendInformation:", sendInformation);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async sendEmailWithFileSystemLogs(to: string | string[]) {
    const subject = "Logs del servidor";
    const htmlBody = `
      <h1>Hello Eli</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <p>Ver los adjuntos</p>
      `;

    const attachments: Attachments[] = [
      { filename: "logs-all.log", path: "./logs/logs-all.log" },
      { filename: "logs-hight.log", path: "./logs/logs-high.log" },
      { filename: "logs-medium.log", path: "./logs/logs-medium.log" },
    ];

    return this.sendEmail({ to, subject, htmlBody, attachments });
  }
}
