import { Component, OnDestroy, OnInit } from '@angular/core'
import {
  CreateLocalTracks,
  DeclineCall
} from '@app/layout/store/call/call.action'
import { callSelector } from '@app/layout/store/call/call.selector'
import { CallState } from '@app/layout/store/call/call.state'
import { UIState } from '@app/layout/store/state'
import { select, Store } from '@ngrx/store'
import { Subject, timer } from 'rxjs'

@Component({
  selector: '[app-call-video-request]',
  templateUrl: './video-request.component.html',
  styleUrls: ['./video-request.component.scss']
})
export class CallVideoRequestComponent implements OnDestroy, OnInit {
  callState: CallState
  acceptedCall = false
  audioPopupTrigger: Subject<void> = new Subject<void>()

  private acceptingTimeout: any
  constructor(private store: Store<UIState>) {
    this.store
      .pipe(select(callSelector))
      .subscribe((callState) => (this.callState = callState))
  }

  ngOnInit() {
    this.startAcceptingTimer()
  }

  ngOnDestroy() {}

  onAcceptVideo() {
    this.acceptedCall = true
    this.store.dispatch(
      new CreateLocalTracks({
        enableAudio: this.callState.hasAudioDeviceAccess,
        enableVideo: true,
        roomName: this.callState.room.name,
        authenticationToken: this.callState.twilioToken
      })
    )
  }

  onAcceptAudio() {
    if (
      !this.callState.hasAudioDeviceAccess ||
      !this.callState.audioInputDevices.length
    ) {
      this.audioPopupTrigger.next()
    } else {
      this.acceptedCall = true
      this.store.dispatch(
        new CreateLocalTracks({
          enableAudio: this.callState.hasAudioDeviceAccess,
          enableVideo: false,
          roomName: this.callState.room.name,
          authenticationToken: this.callState.twilioToken
        })
      )
    }
  }

  onRejectCall() {
    this.store.dispatch(new DeclineCall(this.callState.callId))
  }

  startAcceptingTimer() {
    if (this.acceptingTimeout) {
      this.acceptingTimeout.unsubscribe()
      this.acceptingTimeout = null
    }
    const source = timer(120000)
    // output: 0
    this.acceptingTimeout = source.subscribe((elapsed) => {
      this.acceptingTimeout.unsubscribe()
      if (!this.callState.participantJoined) {
        // FIXME: timeout should be cleared upon hangup
        if (this.callState.callId) {
          this.acceptingTimeout = null

          this.store.dispatch(new DeclineCall(this.callState.callId))
        }
      }
    })
  }
}
