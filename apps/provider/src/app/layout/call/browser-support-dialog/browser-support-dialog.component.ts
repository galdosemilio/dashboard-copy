import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { callSelector, CallState } from '@app/layout/store/call'
import { UIState } from '@app/layout/store/state'
import { _ } from '@app/shared/utils/i18n.utils'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TwilioService } from '../services/twilio.service'

@UntilDestroy()
@Component({
  selector: 'browser-support-dialog',
  templateUrl: './browser-support-dialog.component.html',
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class BrowserSupportDialogComponent implements OnDestroy, OnInit {
  callState: CallState

  message = ''

  constructor(
    private store: Store<UIState>,
    private twilioService: TwilioService,
    private translator: TranslateService
  ) {
    this.store
      .pipe(untilDestroyed(this), select(callSelector))
      .subscribe((callState) => (this.callState = callState))
  }

  ngOnInit() {
    const deviceInfo = this.twilioService.getDeviceInfo()
    if (deviceInfo.browser) {
      if (deviceInfo.browser.toLowerCase() === 'safari') {
        this.translator
          .get([_('CALL.SAFARI_NOT_SUPPORTED')])
          .subscribe((i18n) => {
            this.message = i18n['CALL.SAFARI_NOT_SUPPORTED']
          })
      } else if (deviceInfo.browser.toLowerCase() === 'ms-edge') {
        this.translator
          .get([_('CALL.EDGE_NOT_SUPPORTED')])
          .subscribe((i18n) => {
            this.message = i18n['CALL.EDGE_NOT_SUPPORTED']
          })
      }
    }
  }
  ngOnDestroy() {}
}
