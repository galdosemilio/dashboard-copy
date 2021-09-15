import { Component } from '@angular/core'
import { callSelector } from '@app/layout/store/call/call.selector'
import { CallState } from '@app/layout/store/call/call.state'
import { UIState } from '@app/layout/store/state'
import { select, Store } from '@ngrx/store'
import { UntilDestroy } from '@ngneat/until-destroy'
import {
  BROWSER_TYPES,
  TwilioService
} from '../../../layout/call/services/twilio.service'
import { CloseCallSettings } from '@app/layout/store/call'

@UntilDestroy()
@Component({
  selector: 'ccr-call-settings',
  templateUrl: './call-settings.component.html',
  styleUrls: ['./call-settings.component.scss'],
  host: { class: 'ccr-dialog' }
})
export class CcrCallSettingsComponent {
  BROWSER_TYPES = BROWSER_TYPES
  callState: CallState
  deviceInfo: any

  constructor(private store: Store<UIState>, private twilio: TwilioService) {
    this.store.pipe(select(callSelector)).subscribe((callState) => {
      this.callState = callState
      this.deviceInfo = this.twilio.getDeviceInfo()
    })
  }

  onClose() {
    this.store.dispatch(new CloseCallSettings())
  }
}
