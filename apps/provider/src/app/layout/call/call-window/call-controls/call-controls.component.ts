import { Component, OnInit } from '@angular/core';
import {
  AbortCall,
  DisableCurrentUserCamera,
  DisableCurrentUserMicrophone,
  EnableCurrentUserCamera,
  EnableCurrentUserMicrophone,
  HangUp,
  OpenCallSettings,
  Source,
  UpdateCallStatusToEnded
} from '@app/layout/store/call';
import { callSelector } from '@app/layout/store/call/call.selector';
import { CallState } from '@app/layout/store/call/call.state';
import { UIState } from '@app/layout/store/state';
import { select, Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: '[app-call-controls]',
  templateUrl: './call-controls.component.html',
  styleUrls: ['./call-controls.component.scss']
})
export class CallControlsComponent implements OnInit {
  public callState: CallState;
  public toggleCamera$: Subject<void> = new Subject<void>();
  public toggleMicrophone$: Subject<void> = new Subject<void>();
  public videoPopupTrigger: Subject<void> = new Subject<void>();

  constructor(private store: Store<UIState>) {
    this.store
      .pipe(untilDestroyed(this), select(callSelector))
      .subscribe((callState) => (this.callState = callState));
  }

  public ngOnInit(): void {
    this.toggleCamera$.pipe(untilDestroyed(this), debounceTime(500)).subscribe(() => {
      this.onToggleCamera(this.callState.isCameraEnabled);
    });
    this.toggleMicrophone$.pipe(untilDestroyed(this), debounceTime(500)).subscribe(() => {
      this.onToggleMicrophone(this.callState.isMicrophoneEnabled);
    });
  }

  public ngOnDestroy(): void {}

  public onOpenCallSettings(): void {
    this.store.dispatch(new OpenCallSettings());
  }

  public onHangUp(): void {
    if (this.callState.source === Source.OUTBOUND) {
      this.store.dispatch(new AbortCall(this.callState.callId));
      this.store.dispatch(
        new UpdateCallStatusToEnded({
          callId: this.callState.callId,
          participants: this.callState.room.participants.map(
            (participant) => participant.id
          ),
          callEnded: true
        })
      );
    }

    this.store.dispatch(new HangUp());
  }

  private onToggleMicrophone(isEnabled): void {
    if (isEnabled) {
      this.store.dispatch(new DisableCurrentUserMicrophone());
    } else {
      this.store.dispatch(new EnableCurrentUserMicrophone());
    }
  }

  private onToggleCamera(isEnabled): void {
    if (this.callState.callId === '' || !this.callState.hasVideoDeviceAccess) {
      this.videoPopupTrigger.next();
      return;
    }

    if (isEnabled) {
      this.store.dispatch(new DisableCurrentUserCamera());
    } else {
      this.store.dispatch(new EnableCurrentUserCamera());
    }
  }
}
