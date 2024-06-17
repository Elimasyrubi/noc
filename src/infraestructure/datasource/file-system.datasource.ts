import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import fs from 'fs'

export class FileSystemDatasource implements LogDataSource {

  private readonly logPath = 'logs/'
  private readonly allLogsPath = 'logs/logs-all.log'
  private readonly mediumLogsPath = 'logs/logs-medium.log'
  private readonly highLogsPath = 'logs/logs-high.log'

  constructor() {
    this.createLogFiles()
  }

  private createLogFiles = () => {
    if (!fs.existsSync(this.logPath)) {
      fs.mkdirSync(this.logPath)
    }

    const paths = [this.allLogsPath, this.mediumLogsPath, this.highLogsPath]
    paths.forEach(path => {
      if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '')
      }
    })
  }

  private getLogsFromFile = (path: string): LogEntity[] => {
    const content = fs.readFileSync(path, 'utf-8');
    if(content === '') return []
    const logs = content.split('\n').map(log => LogEntity.fromJson(log));
    return logs
  }

  async saveLog(newLog: LogEntity): Promise<void> {
    const logAsJson = `${JSON.stringify(newLog)}\n`
    fs.appendFileSync(this.allLogsPath, logAsJson);
    if (newLog.level === LogSeverityLevel.low) return;
    if (newLog.level === LogSeverityLevel.medium) {
      fs.appendFileSync(this.mediumLogsPath, logAsJson);
    } else {
      fs.appendFileSync(this.highLogsPath, logAsJson);
    }
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    switch (severityLevel) {
      case LogSeverityLevel.low:
        return this.getLogsFromFile(this.allLogsPath)
        case LogSeverityLevel.medium:
        return this.getLogsFromFile(this.mediumLogsPath)
        case LogSeverityLevel.high:
        return this.getLogsFromFile(this.highLogsPath)
      default:
        throw new Error(`${severityLevel} not implemented`)
    }
  }
}