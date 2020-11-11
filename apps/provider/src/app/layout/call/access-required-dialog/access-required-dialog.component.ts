import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { MatDialogRef } from '@coachcare/material'
import { callSelector, CallState } from '@app/layout/store/call'
import {
  CHECK_DEVICES_COMPLETE,
  CheckDevices,
  CheckDevicesComplete
} from '@app/layout/store/call/call.action'
import { UIState } from '@app/layout/store/state'
import { ContextService, SelectedOrganization } from '@app/service'
import { Actions, ofType } from '@ngrx/effects'
import { select, Store } from '@ngrx/store'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { Subscription } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { BROWSER_TYPES, TwilioService } from '../services/twilio.service'

@Component({
  selector: 'access-required-dialog',
  templateUrl: './access-required-dialog.component.html',
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class AccessRequiredDialogComponent implements OnDestroy, OnInit {
  callState: CallState
  deviceAvailability: any
  hasChecked = false
  organization: SelectedOrganization
  showAdditionalInfoNotice = false
  subscriptions: Subscription[]

  constructor(
    private actions$: Actions,
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private dialogRef: MatDialogRef<AccessRequiredDialogComponent>,
    private store: Store<UIState>,
    private twilio: TwilioService
  ) {
    this.subscriptions = [
      this.store
        .pipe(select(callSelector))
        .subscribe((callState) => (this.callState = callState)),
      this.context.organization$.subscribe(
        (organization) => (this.organization = organization)
      )
    ]
  }

  ngOnDestroy() {}

  ngOnInit() {
    this.showAdditionalInfoNotice =
      this.twilio.getDeviceInfo().browser.toLowerCase() ===
      BROWSER_TYPES.FIREFOX
    this.subscriptions = [
      ...this.subscriptions,
      this.actions$
        .pipe(
          ofType(CHECK_DEVICES_COMPLETE),
          untilDestroyed(this),
          map((action) => (action as CheckDevicesComplete).payload),
          tap((deviceAvailability) => {
            this.hasChecked = true
            this.deviceAvailability = deviceAvailability
            this.cdr.detectChanges()
            this.dialogRef.close(deviceAvailability)
          })
        )
        .subscribe()
    ]
    this.onCheckAgain()
  }

  onCheckAgain() {
    this.hasChecked = false
    this.store.dispatch(new CheckDevices())
  }
}
