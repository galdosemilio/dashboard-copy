import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import {
  callSelector,
  CallState,
  DisableCurrentUserCamera,
  DisableCurrentUserMicrophone,
  EnableCurrentUserCamera,
  EnableCurrentUserMicrophone,
  HangUp,
  SetCallIsExpected,
  SetLocalVideoEnabled
} from '@app/layout/store/call'
import { ContextService } from '@app/service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@coachcare/material'
import { NamedEntity } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Store } from '@ngrx/store'
import { DeviceDetectorService } from 'ngx-device-detector'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { LocalVideoTrack } from 'twilio-video'

export interface CcrCallWaitingRoomProps {
  attendeeEntities: NamedEntity[]
}
interface CcrCallWaitingRoomState {
  video: {
    enabled: boolean
    track?: LocalVideoTrack
  }
}

@UntilDestroy()
@Component({
  selector: 'ccr-call-waiting-room',
  templateUrl: './call-waiting-room.component.html',
  styleUrls: ['./call-waiting-room.component.scss'],
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class CcrCallWaitingRoomComponent implements OnInit {
  @ViewChild('videoPreview', { static: false }) videoPreview

  public callState: CallState
  public currentUserId: string
  public isMobile = false
  public isCallStarted = false
  public showSettings = true
  public toggleCamera$: Subject<void> = new Subject<void>()
  public toggleMicrophone$: Subject<void> = new Subject<void>()
  public videoPopupTrigger: Subject<void> = new Subject<void>()

  private callDidStart = false
  private state: CcrCallWaitingRoomState = { video: { enabled: true } }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CcrCallWaitingRoomProps,
    private context: ContextService,
    private deviceDetector: DeviceDetectorService,
    private dialogRef: MatDialogRef<CcrCallWaitingRoomComponent>,
    private store: Store<CallState>
  ) {}

  public ngOnInit(): void {
    this.currentUserId = this.context.user.id
    this.isMobile =
      this.deviceDetector.isMobile() || this.deviceDetector.isTablet()

    this.store.dispatch(new SetCallIsExpected(true))
    this.store.dispatch(new SetLocalVideoEnabled(true))
    this.store.dispatch(new EnableCurrentUserCamera())

    this.store
      .select(callSelector)
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        this.callState = state
        this.isCallStarted = this.callState.isCallStarted
        this.callDidStart = this.callDidStart || this.isCallStarted

        if (this.isCallStarted) {
          this.dialogRef.close()
        }

        // means the call started AND ended
        if (!this.isCallStarted && this.callDidStart) {
          this.hangUp()
        }
      })

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

  public hangUp(): void {
    if (this.callState.callId) {
      this.store.dispatch(new HangUp())
    }

    this.store.dispatch(new SetCallIsExpected(false))
    this.dialogRef.close()
  }

  public onVideoTrackChange(track: LocalVideoTrack): void {
    this.disableVideoPreview()

    this.state.video.track = track

    this.enableVideoPreview()
  }

  public toggleSettingsSection(): void {
    this.showSettings = !this.showSettings
  }

  private disableVideoPreview(): void {
    if (this.state.video.track) {
      this.state.video.track
        .detach()
        .forEach((detachedElement) => detachedElement.remove())
      this.state.video.enabled = false
    }
  }

  private enableVideoPreview(): void {
    this.state.video.enabled = true
    const element = this.state.video.track.attach()
    element.style.width = '100%'
    element.style.height = 'auto'
    element.style.maxHeight = '100vh'
    element.setAttribute('muted', 'true')
    this.videoPreview.nativeElement.appendChild(element)
  }

  private onToggleCamera(isEnabled: boolean): void {
    if (!this.callState.callId) {
      this.toggleLocalCamera(isEnabled)
    }

    if (this.callState.callId === '' || !this.callState.hasVideoDeviceAccess) {
      this.videoPopupTrigger.next()
      return
    }

    this.store.dispatch(
      isEnabled ? new DisableCurrentUserCamera() : new EnableCurrentUserCamera()
    )
  }

  private onToggleMicrophone(isEnabled): void {
    this.store.dispatch(
      isEnabled
        ? new DisableCurrentUserMicrophone()
        : new EnableCurrentUserMicrophone()
    )
  }

  private toggleLocalCamera(isEnabled: boolean): void {
    if (isEnabled) {
      this.store.dispatch(new DisableCurrentUserCamera())
      this.store.dispatch(new SetLocalVideoEnabled(false))
      this.disableVideoPreview()
    } else {
      this.store.dispatch(new EnableCurrentUserCamera())
      this.store.dispatch(new SetLocalVideoEnabled(true))
      this.enableVideoPreview()
    }
  }
}
