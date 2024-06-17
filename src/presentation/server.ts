import { envs } from "../config/plugins/env.plugins";
import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDatasource } from "../infraestructure/datasource/file-system.datasource";
import { MongoLogDataSource } from "../infraestructure/datasource/mongo-log-datasource";
import { LogRepositoryImpl } from "../infraestructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";

const logRepository = new LogRepositoryImpl(
  // new FileSystemDatasource(),
  new MongoLogDataSource()
  // new Postgress()
);

export class Server {
  static start() {
    console.log('Server started..')
    // Send email

    // const emailService = new EmailService();
    // emailService.sendEmail({
    //   to: "eliezermasyrubi.ar@gmail.com",
    //   subject: "Test From node",
    //   htmlBody: `
    //   <h1>Hello Eli</h1>
    //   <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    //   <p>Ver los adjuntos</p>
    //   `,
    // });
    
    // emailService.sendEmailWithFileSystemLogs(['elimasyrubi.biblia@gmail.com', 'eliezermasyrubi.ar@gmail.com']);

    CronService.createJob(
      '*/3 * * * * *',
      () => {
        const url = 'https://google.com'
        // const url = 'http://localhost:3000'
        new CheckService(
          logRepository,
          () => console.log(`${url} is ok`),
          (error: string) => console.log(error),
        ).execute(url)
      }
    )
  }
}
