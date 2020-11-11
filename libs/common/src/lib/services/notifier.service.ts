import { Injectable } from '@angular/core'
import { MatDialog, MatSnackBar } from '@coachcare/material'
import { _ } from '@coachcare/backend/shared'
import { ConfirmDialog } from '@coachcare/common/dialogs/core'
import { TranslateService } from '@ngx-translate/core'
import { ConfigService } from './config.service'

export enum NotifierStatus {
  success = 'ccr-snack-success',
  info = 'ccr-snack-info',
  warning = 'ccr-snack-warning',
  error = 'ccr-snack-error'
}

@Injectable()
export class NotifierService {
  private duration: number

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private translator: TranslateService,
    config: ConfigService
  ) {
    this.duration = config.get('app.durations.notifier', 4500)
  }

  // TODO remove any and use an specific ComponentType
  snackFromComponent(component: any, duration: number | undefined): void {
    this.snackbar.openFromComponent(component, {
      duration: duration ? duration : this.duration
    })
  }

  snack(
    message: string,
    action = '',
    duration: number | undefined,
    status: NotifierStatus
  ): void {
    if (!message) {
      return
    }

    const show = (msg: string) => {
      this.snackbar.open(msg, action, {
        duration: duration ? duration : this.duration,
        panelClass: [status]
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

  success(message: any, action = '', duration?: number | undefined): void {
    this.snack(
      this.translate(message),
      action,
      duration,
      NotifierStatus.success
    )
  }

  info(message: any, action = '', duration?: number | undefined): void {
    this.snack(this.translate(message), action, duration, NotifierStatus.info)
  }

  warning(message: any, action = '', duration?: number | undefined): void {
    this.snack(
      this.translate(message),
      action,
      duration,
      NotifierStatus.warning
    )
  }

  error(message: any, action = '', duration?: number | undefined): void {
    this.snack(this.translate(message), action, duration, NotifierStatus.error)
  }

  log(err: any, trace?: any) {
    // TODO any additional logging here
    console.error(err)
  }

  done(msg: any) {
    this.dialog.open(ConfirmDialog, {
      data: {
        title: _('GLOBAL.DONE'),
        content: this.translate(msg)
      }
    })
  }

  confirm(err: any) {
    this.dialog.open(ConfirmDialog, {
      data: {
        title: _('GLOBAL.ERROR'),
        content: this.translate(err)
      }
    })
  }

  translate(msg: any): string {
    // check for already translated messages
    if (typeof msg === 'string' && msg.startsWith('NOTIFY.')) {
      return msg
    }

    // convert any non-string input here
    if (typeof msg === 'object') {
      if (msg.message) {
        msg = msg.message
      } else {
        // TODO
        console.error('Notifier.translate: Unrecognized input object', msg)
      }
    }

    return msg
  }
}
