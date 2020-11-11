import { Injectable } from '@angular/core'
import { MatDialog, MatSnackBar } from '@coachcare/material'
import { ConfirmDialog } from '@app/shared/dialogs/confirm.dialog'
import { AddLogRequest } from '@coachcare/npm-api'
import { _ } from '@app/shared/utils'
import { TranslateService } from '@ngx-translate/core'
import { ConfigService } from './config.service'
import { LoggingService } from './logging.service'

export enum NotifierStatus {
  success = 'ccr-snack-success',
  info = 'ccr-snack-info',
  warning = 'ccr-snack-warning',
  error = 'ccr-snack-error'
}

export interface NotifierOptions {
  action?: string
  duration?: number | null
  status?: NotifierStatus
  log?: boolean
  data?: any
}

@Injectable()
export class NotifierService {
  private duration: number

  constructor(
    private dialog: MatDialog,
    private logging: LoggingService,
    private snackbar: MatSnackBar,
    private translator: TranslateService,
    config: ConfigService
  ) {
    this.duration = config.get('app.durations.notifier', 4500)
  }

  // TODO remove any and use an specific ComponentType
  snackFromComponent(component: any, duration = null): void {
    this.snackbar.openFromComponent(component, {
      duration: duration ? duration : this.duration
    })
  }

  snack(message: string, options?: NotifierOptions): void {
    if (!message) {
      return
    }

    const show = (msg: string) => {
      this.snackbar.open(msg, options.action, {
        duration: options.duration ? options.duration : this.duration,
        panelClass: [options.status]
      })
    }

    // TODO support action translations and predefined ones
    if (message.startsWith('NOTIFY.')) {
      // support translatable strings starting with NOTIFY.
      this.translator.get(message).subscribe((msg: string) => {
        show(msg)
      })
    } else {
      // direct error messages
      show(message)
    }
  }

  success(message, options: NotifierOptions = {}): void {
    this.snack(this.translate(message), {
      status: NotifierStatus.success,
      ...options
    })
    if (options.log) {
      this.logging.log({ logLevel: 'info', data: options.data })
    }
  }

  info(message, options: NotifierOptions = {}): void {
    this.snack(this.translate(message), {
      status: NotifierStatus.info,
      ...options
    })
    if (options.log) {
      this.logging.log({ logLevel: 'info', data: options.data })
    }
  }

  warning(message, options: NotifierOptions = {}): void {
    this.snack(this.translate(message), {
      status: NotifierStatus.warning,
      ...options
    })
    if (options.log) {
      this.logging.log({ logLevel: 'warn', data: options.data })
    }
  }

  error(message, options: NotifierOptions = {}): void {
    this.snack(this.translate(message), {
      status: NotifierStatus.error,
      ...options
    })
    if (options.log) {
      this.logging.log({ logLevel: 'error', data: options.data })
    }
  }

  log(err, trace?: any) {
    // TODO any additional logging here
    console.error(err)
  }

  done(msg) {
    this.dialog.open(ConfirmDialog, {
      data: {
        title: _('GLOBAL.DONE'),
        content: this.translate(msg)
      }
    })
  }

  confirm(err) {
    this.dialog.open(ConfirmDialog, {
      data: {
        title: _('GLOBAL.ERROR'),
        content: this.translate(err)
      }
    })
  }

  translate(msg: any): string {
    // check for already thanslated messages
    if (typeof msg === 'string' && msg.startsWith('NOTIFY.')) {
      return msg
    }

    // TODO convert any non-string input here
    if (typeof msg === 'object') {
      if (msg.message) {
        msg = msg.message
      } else {
        // TODO
        console.error('Untranslated Input Object', msg)
      }
    }

    return msg
  }
}
