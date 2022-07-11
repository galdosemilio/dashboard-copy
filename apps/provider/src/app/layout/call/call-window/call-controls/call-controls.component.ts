import { Component, OnDestroy, OnInit } from '@angular/core'
import {
  AbortCall,
  ApplyVideoBackgroundSetting,
  DisableCurrentUserCamera,
  DisableCurrentUserMicrophone,
  EnableCurrentUserCamera,
  EnableCurrentUserMicrophone,
  HangUp,
  OpenCallSettings,
  SetAttemptingReconnect,
  Source,
  UpdateCallStatusToEnded
} from '@app/layout/store/call'
import { callSelector } from '@app/layout/store/call/call.selector'
import { CallState } from '@app/layout/store/call/call.state'
import { UIState } from '@app/layout/store/state'
import { select, Store } from '@ngrx/store'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { Browser } from '@app/shared'
import { resolveConfig } from '@app/config/section'
import { ContextService } from '@app/service'
import { DeviceDetectorService } from 'ngx-device-detector'

@UntilDestroy()
@Component({
  selector: '[app-call-controls]',
  templateUrl: './call-controls.component.html',
  styleUrls: ['./call-controls.component.scss']
})
export class CallControlsComponent implements OnDestroy, OnInit {
  public callState: CallState
  public shouldShowCallBackground = false
  public toggleBackgroundImage$: Subject<void> = new Subject<void>()
  public toggleCamera$: Subject<void> = new Subject<void>()
  public toggleMicrophone$: Subject<void> = new Subject<void>()
  public videoPopupTrigger: Subject<void> = new Subject<void>()
  public callBackgroundUrl: string

  constructor(
    private context: ContextService,
    private deviceDetector: DeviceDetectorService,
    private store: Store<UIState>
  ) {
    this.store
      .pipe(untilDestroyed(this), select(callSelector))
      .subscribe((callState) => (this.callState = callState))
  }

  public ngOnInit(): void {
    this.shouldShowCallBackground =
      Browser.isChrome(this.deviceDetector) &&
      (resolveConfig(
        'COMMUNICATIONS.ENABLE_CALL_BACKGROUNDS',
        this.context.organization
      ) ??
        false)

    this.callBackgroundUrl =
      resolveConfig(
        'COMMUNICATIONS.CALL_BACKGROUND_URL',
        this.context.organization
      ) || 'assets/img/callwallpaper.png'

    this.toggleBackgroundImage$
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe(() =>
        this.onToggleBackgroundImage(this.callState.videoBackgroundEnabled)
      )
    this.toggleCamera$
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe(() => {
        this.onToggleCamera(this.callState.isCameraEnabled)
      })
    this.toggleMicrophone$
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe(() => {
        this.onToggleMicrophone(this.callState.isMicrophoneEnabled)
      })
  }

  public ngOnDestroy(): void {}

  public onOpenCallSettings(): void {
    this.store.dispatch(new OpenCallSettings())
  }

  public onHangUp(): void {
    if (this.callState.source === Source.OUTBOUND) {
      this.store.dispatch(new AbortCall(this.callState.callId))
      this.store.dispatch(new SetAttemptingReconnect(false))
      this.store.dispatch(
        new UpdateCallStatusToEnded({
          callId: this.callState.callId,
          participants: this.callState.room.participants.map(
            (participant) => participant.id
          ),
          callEnded: true
        })
      )
    }

    this.store.dispatch(new HangUp())
  }

  private async onToggleBackgroundImage(isEnabled): Promise<void> {
    this.store.dispatch(
      new ApplyVideoBackgroundSetting({
        enabled: !isEnabled,
        url: this.callBackgroundUrl
      })
    )
  }

  private onToggleCamera(isEnabled: boolean): void {
    if (this.callState.callId === '' || !this.callState.hasVideoDeviceAccess) {
      this.videoPopupTrigger.next()
      return
    }

    this.store.dispatch(
      isEnabled ? new DisableCurrentUserCamera() : new EnableCurrentUserCamera()
    )
  }

  private onToggleMicrophone(isEnabled: boolean): void {
    this.store.dispatch(
      isEnabled
        ? new DisableCurrentUserMicrophone()
        : new EnableCurrentUserMicrophone()
    )
  }
}
