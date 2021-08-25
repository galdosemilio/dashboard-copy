import { Component, OnDestroy, OnInit } from '@angular/core'
import {
  AcceptCall,
  CancelCall,
  DeclineCall
} from '@app/layout/store/call/call.action'
import { callSelector } from '@app/layout/store/call/call.selector'
import { CallState } from '@app/layout/store/call/call.state'
import { UIState } from '@app/layout/store/state'
import { ContextService } from '@app/service'
import { Conference } from '@coachcare/sdk'
import { select, Store } from '@ngrx/store'
import { Subject, timer } from 'rxjs'

@Component({
  selector: '[app-call-video-request]',
  templateUrl: './video-request.component.html',
  styleUrls: ['./video-request.component.scss']
})
export class CallVideoRequestComponent implements OnDestroy, OnInit {
  callPollInterval: number
  callState: CallState
  acceptedCall = false
  audioPopupTrigger: Subject<void> = new Subject<void>()

  private acceptingTimeout: any
  private fetchingCallDetails = false
  constructor(
    private communication: Conference,
    private context: ContextService,
    private store: Store<UIState>
  ) {
    this.store
      .pipe(select(callSelector))
      .subscribe((callState) => (this.callState = callState))
  }

  ngOnInit() {
    this.startAcceptingTimer()
    this.startCallPolling()
  }

  ngOnDestroy() {
    this.stopCallPolling()
  }

  onAcceptVideo() {
    this.acceptedCall = true
    this.stopCallPolling()
    this.store.dispatch(new AcceptCall({ enableVideo: true }))
  }

  onAcceptAudio() {
    if (
      !this.callState.hasAudioDeviceAccess ||
      !this.callState.audioInputDevices.length
    ) {
      this.audioPopupTrigger.next()
    } else {
      this.acceptedCall = true
      this.stopCallPolling()
      this.store.dispatch(new AcceptCall({ enableVideo: false }))
    }
  }

  onRejectCall() {
    this.stopCallPolling()
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

  private startCallPolling(): void {
    this.callPollInterval = setInterval(async () => {
      try {
        if (this.fetchingCallDetails || !this.callState.callId) {
          return
        }
        this.fetchingCallDetails = true

        const callDetail = await this.communication.fetchCallDetail({
          callId: this.callState.callId
        })

        if (
          callDetail.participants.attended.some(
            (participant) => participant.id === this.context.user.id
          )
        ) {
          this.store.dispatch(new CancelCall())
        }
      } catch (error) {
      } finally {
        this.fetchingCallDetails = false
      }
    }, 5000)
  }

  private stopCallPolling(): void {
    if (!this.callPollInterval) {
      return
    }
    clearInterval(this.callPollInterval)
    this.callPollInterval = null
  }
}
