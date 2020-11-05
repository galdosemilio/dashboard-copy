import { Injectable } from '@angular/core'
import { AddLogRequest } from '@coachcare/npm-api'
import { environment } from '../../environments/environment'
import { Logging } from '@coachcare/npm-api'
import { LanguageService } from './language.service'

interface Log extends Partial<AddLogRequest> {
  data: any
}

@Injectable()
export class LoggingService {
  public app: AddLogRequest['app'] = 'ccr-staticProvider'

  private logInfo: AddLogRequest = {
    app: this.app,
    keywords: [],
    logLevel: 'info',
    message: ''
  }

  constructor(private logging: Logging, private lang: LanguageService) {}

  public getProvider(): Logging {
    return this.logging
  }

  public log(log: Log): Promise<void> {
    const envInfo = this.generateEnvInfo()
    const request: AddLogRequest = Object.assign(
      {},
      this.logInfo,
      { logLevel: log.logLevel, message: log.data.message, data: undefined },
      { keywords: [{ ...envInfo, ...log.data }] }
    ) as AddLogRequest
    return this.logging.add(request)
  }

  private generateEnvInfo() {
    return {
      platform: window.navigator.appVersion,
      APIEnv: environment.selveraApiEnv,
      deviceLocale: this.lang.get(),
      userAgent: window.navigator.userAgent
    }
  }
}
