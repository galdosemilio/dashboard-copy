import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core'
import {
  STORAGE_CALL_WINDOW_CORNER,
  STORAGE_VIDEOCONFERENCE_SETTINGS
} from '@app/config'
import { UIState } from '@app/layout/store'
import { callSelector } from '@app/layout/store/call'
import {
  ABORT_CALL,
  AbortCall,
  CALL_EMPTY,
  CANCEL_CALL,
  CancelCall,
  CheckDevices,
  CreateLocalTracks,
  HANG_UP,
  HangUp,
  PARTICIPANT_DECLINED,
  ParticipantDeclined,
  PlayCallEndedAudio,
  Reinitialize,
  SetAttemptingReconnect,
  Source,
  UPDATE_CALL_STATUS_TO_ENDED,
  UpdateCallStatusToEnded
} from '@app/layout/store/call/call.action'
import { CallState } from '@app/layout/store/call/call.state'
import { NotifierService } from '@app/service/notifier.service'
import { ConnectionStats, ConnectionStatus } from '@coachcare/sdk'
import { _ } from '@app/shared/utils/i18n.utils'
import { Actions, ofType } from '@ngrx/effects'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import * as moment from 'moment'
import { Subscription } from 'rxjs'
import { auditTime, map, tap } from 'rxjs/operators'
import * as CallActions from '../../store/call'
import { TwilioBandwidthService } from '../services/twilio-bandwidth.service'
import { TwilioService } from '../services/twilio.service'
import { ContextService, GestureService } from '@app/service'
import { resolveConfig } from '@app/config/section'
import { ApplyVideoBackgroundSetting } from '../../../layout/store/call/call.action'
import { DeviceDetectorService } from 'ngx-device-detector'
import { Browser } from '@app/shared'

interface StickyArea {
  x: number
  y: number
  height: number
  width: number
  clampPosition: { x: number; y: number }
}

@Component({
  selector: 'app-call-window',
  templateUrl: './call-window.component.html',
  styleUrls: ['./call-window.component.scss']
})
export class CallWindowComponent
  implements AfterViewInit, OnInit, OnDestroy, AfterViewInit
{
  public callState: CallState
  public remoteConnectionStatus: ConnectionStatus
  public dragHandleCoords = { x: 150, y: 10 }
  public lastSticky: StickyArea
  public ringingCountdown: number
  public stickies: HTMLElement[] = []
  public stickyAreas: StickyArea[] = [
    {
      x: 4,
      y: 5,
      width: 25,
      height: 30,
      clampPosition: { x: 25, y: 25 }
    },
    {
      x: -4,
      y: 5,
      width: 25,
      height: 30,
      clampPosition: { x: -25, y: 25 }
    },
    {
      x: 4,
      y: -5,
      width: 25,
      height: 30,
      clampPosition: { x: 25, y: -25 }
    },
    {
      x: -4,
      y: -5,
      width: 25,
      height: 30,
      clampPosition: { x: -25, y: -25 }
    }
  ]
  private subscriptions: Subscription[] = []

  private callAttemptDuration = 90000
  private callWindow: Element
  private currentRemoteVideoState: boolean
  private inactivityTimeout = 60000
  private inactivityTimeoutInterval
  private inactivityTimeoutActive = false
  private dataTrackTimeout = 4
  private ringingCountdownInterval: any

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private deviceDetector: DeviceDetectorService,
    private gesture: GestureService,
    private store: Store<UIState>,
    private translator: TranslateService,
    private notifier: NotifierService,
    private actions$: Actions,
    private twilioBandwidth: TwilioBandwidthService,
    private twilioService: TwilioService
  ) {
    this.checkRemoteConnectivityStatus =
      this.checkRemoteConnectivityStatus.bind(this)
    this.moveWindowToPointer = this.moveWindowToPointer.bind(this)
    this.stopFollowingPointer = this.stopFollowingPointer.bind(this)
  }

  ngOnInit() {
    this.subscriptions = [
      this.store.pipe(select(callSelector)).subscribe((callState) => {
        this.callState = callState
        if (callState.isBeingDragged) {
          this.startFollowingPointer()
        }
        this.cdr.detectChanges()
      }),
      this.actions$
        .pipe(
          ofType(PARTICIPANT_DECLINED),
          map((action) => (action as ParticipantDeclined).payload),
          tap(() => {
            if (
              this.callState.room.participants.filter(
                (participant) => participant.isParticipating
              ).length === 0
            ) {
              this.store.dispatch(
                new UpdateCallStatusToEnded({
                  callId: this.callState.callId,
                  participants: this.callState.room.participants.map(
                    (participant) => participant.id
                  ),
                  callEnded: true
                })
              )
              this.store.dispatch(new PlayCallEndedAudio())
              this.store.dispatch(new CancelCall())
            }
          })
        )
        .subscribe(),
      this.actions$
        .pipe(
          ofType(
            HANG_UP,
            CALL_EMPTY,
            UPDATE_CALL_STATUS_TO_ENDED,
            ABORT_CALL,
            CANCEL_CALL
          ),
          tap(() => {
            if (this.inactivityTimeoutInterval) {
              clearTimeout(this.inactivityTimeoutInterval)
            }

            this.stopRingingInterval()
          })
        )
        .subscribe(),
      this.twilioBandwidth.connectionUpdate$
        .pipe(auditTime(300))
        .subscribe(this.checkRemoteConnectivityStatus)
    ]

    if (
      this.callState.isCallStarted &&
      this.callState.source === Source.OUTBOUND
    ) {
      this.startRingingTimer()
    }

    this.store.dispatch(new CheckDevices())
    this.gesture.pause()
  }

  ngOnDestroy() {
    this.stopRingingInterval()
    this.gesture.resume()
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  public ngAfterViewInit(): void {
    this.resolveCallBackgroundSettings()

    this.stickies = Array.from(
      document.body.querySelectorAll('.ccr-call-window-sticky')
    )
    this.callWindow = document.body.querySelector('.ccr-call-window')

    if (!this.callState.hasEnteredRoom) {
      if (
        this.callState.source === Source.OUTBOUND ||
        (this.callState.source === Source.INBOUND && this.callState.isReconnect)
      ) {
        const storageSettings = JSON.parse(
          window.localStorage.getItem(STORAGE_VIDEOCONFERENCE_SETTINGS)
        )
        this.store.dispatch(
          new CreateLocalTracks({
            enableAudio: this.callState.hasAudioDeviceAccess,
            enableVideo: (storageSettings && storageSettings.video) || false,
            videoInputDevice: this.callState.selectedVideoInputDevice,
            audioInputDevice: this.callState.selectedAudioInputDevice,
            audioOutputDevice: this.callState.selectedAudioOutputDevice,
            roomName: this.callState.room.name,
            authenticationToken: this.callState.twilioToken,
            videoBackgroundEnabled: this.callState.videoBackgroundEnabled,
            videoBackgroundUrl: this.callState.videoBackgroundUrl
          })
        )
        window.localStorage.removeItem(STORAGE_VIDEOCONFERENCE_SETTINGS)
      }
    } else {
      this.store.dispatch(new Reinitialize())
    }

    const callWindowCorner = window.localStorage.getItem(
      STORAGE_CALL_WINDOW_CORNER
    )
    if (
      this.callState.lastPosition &&
      this.callState.windowState === 'DEFAULT'
    ) {
      setTimeout(() => this.fixWindow(this.callState.lastPosition))
    } else if (callWindowCorner && Number(callWindowCorner) > -1) {
      setTimeout(() => this.fixWindow(this.stickyAreas[callWindowCorner]))
    }
  }

  followPointer() {
    this.store.dispatch(new CallActions.ToggleDrag(undefined))
  }

  removeTwilioId(participant): string {
    const name = participant
    const idIndex = name.indexOf('(')
    if (idIndex !== -1) {
      return name.substring(0, idIndex).trim()
    } else {
      return participant
    }
  }

  startRingingTimer() {
    this.stopRingingInterval()

    this.ringingCountdown = this.callAttemptDuration / 1000

    this.ringingCountdownInterval = setInterval(() => {
      --this.ringingCountdown

      if (this.ringingCountdown < 0) {
        clearInterval(this.ringingCountdownInterval)
        this.ringingCountdownInterval = null

        if (!this.callState.participantJoined) {
          // FIXME: timeout should be cleared upon hangup
          if (this.callState.callId) {
            const snack = (msg: string) => {
              const participantsText = this.callState.room.participants
                .map((participant) => participant.name)
                .join(', ')
              this.notifier.info(`${participantsText} ${msg}`)
            }
            // support translatable strings starting with NOTIFY.
            this.translator
              .get([_('NOTIFY.INFO.NO_ANSWER')])
              .subscribe((translations) => {
                snack(translations['NOTIFY.INFO.NO_ANSWER'])
              })
            this.store.dispatch(
              new UpdateCallStatusToEnded({
                callId: this.callState.callId,
                participants: this.callState.room.participants.map(
                  (participant) => participant.id
                ),
                callEnded: true
              })
            )
            this.store.dispatch(new AbortCall(this.callState.callId))
            this.store.dispatch(new HangUp())
          }
        }
      }
    }, 1000)
  }

  private checkRemoteConnectivityStatus(
    allConnectionStats: ConnectionStats[]
  ): void {
    const remoteConnStats = allConnectionStats.find(
      (connectionStats) => !connectionStats.isLocal
    )

    if (!remoteConnStats) {
      return
    }

    this.checkRemoteConnectivityAge(remoteConnStats)

    this.remoteConnectionStatus = remoteConnStats.status

    switch (this.remoteConnectionStatus) {
      case ConnectionStatus.IDLE:
        this.twilioService.hideVideoContainer(remoteConnStats.id)
        break

      case ConnectionStatus.REFOCUS:
        this.twilioService.showVideoContainer(remoteConnStats.id)
        break
    }

    if (
      this.currentRemoteVideoState === remoteConnStats.hasMobileVideoEnabled
    ) {
      return
    }

    this.currentRemoteVideoState = remoteConnStats.hasMobileVideoEnabled

    if (!this.twilioBandwidth.listenToVideoDataTrack) {
      return
    }

    if (remoteConnStats.hasMobileVideoEnabled) {
      this.twilioService.showVideoContainer(remoteConnStats.id)
    } else {
      this.twilioService.hideVideoContainer(remoteConnStats.id)
    }
  }

  private checkRemoteConnectivityAge(remoteConnStats: ConnectionStats) {
    if (this.twilioBandwidth.currentRemoteConnSkips > 0) {
      --this.twilioBandwidth.currentRemoteConnSkips
      return
    }

    if (this.remoteConnectionStatus === ConnectionStatus.IDLE) {
      this.store.dispatch(new SetAttemptingReconnect(false))
      return
    }

    const age = moment().diff(moment(remoteConnStats.timestamp), 'seconds')

    if (
      age >= this.dataTrackTimeout &&
      !this.callState.isAttemptingToReconnect
    ) {
      this.store.dispatch(new SetAttemptingReconnect(true))
      this.startInactivityTimeout()
    } else if (
      age < this.dataTrackTimeout &&
      this.callState.isAttemptingToReconnect
    ) {
      this.store.dispatch(new SetAttemptingReconnect(false))
    }
  }

  private checkStickyAreas(position: any): StickyArea | null {
    const stickyAreas = this.stickies.map((sticky, index) => ({
      x: sticky.offsetLeft,
      y: sticky.offsetTop,
      width: sticky.clientWidth,
      height: sticky.clientHeight,
      clampPosition: this.stickyAreas[index].clampPosition
    }))

    return stickyAreas.find(
      (sticky) =>
        position.x >= sticky.x &&
        position.x <= sticky.x + sticky.width &&
        position.y >= sticky.y &&
        position.y <= sticky.y + sticky.height
    )
  }

  private fixWindow(sticky: StickyArea) {
    let styleString = `position: absolute;`
    if (sticky.clampPosition.x > 0) {
      styleString += `left: ${sticky.clampPosition.x}px;`
    } else {
      styleString += `right: ${-sticky.clampPosition.x}px;`
    }

    if (sticky.clampPosition.y > 0) {
      styleString += `top: ${sticky.clampPosition.y}px;`
    } else {
      styleString += `bottom: ${-sticky.clampPosition.y}px;`
    }

    styleString += `transition: all 0.1s ease-in-out;`

    if (this.callWindow) {
      this.callWindow.setAttribute('style', styleString)
    }

    window.localStorage.setItem(
      STORAGE_CALL_WINDOW_CORNER,
      this.stickyAreas
        .findIndex(
          (stickyArea) =>
            stickyArea.clampPosition.x === sticky.clampPosition.x &&
            stickyArea.clampPosition.y === sticky.clampPosition.y
        )
        .toString()
    )
  }

  private moveWindowToPointer($event: MouseEvent) {
    this.callWindow.setAttribute(
      'style',
      `position: absolute; top: ${
        $event.clientY - this.dragHandleCoords.y
      }px; left: ${$event.clientX - this.dragHandleCoords.x}px;`
    )
  }

  private resolveCallBackgroundSettings(): void {
    const shouldShowCallBackground =
      Browser.isChrome(this.deviceDetector) &&
      (resolveConfig(
        'COMMUNICATIONS.ENABLE_CALL_BACKGROUNDS',
        this.context.organization
      ) ??
        false)

    const backgroundUrl: string =
      resolveConfig(
        'COMMUNICATIONS.CALL_BACKGROUND_URL',
        this.context.organization
      ) ?? 'assets/img/callwallpaper.png'

    this.store.dispatch(
      shouldShowCallBackground
        ? new ApplyVideoBackgroundSetting({
            enabled: this.callState.videoBackgroundEnabled,
            url: backgroundUrl
          })
        : new ApplyVideoBackgroundSetting({ enabled: false })
    )
  }

  private startInactivityTimeout(): void {
    if (this.inactivityTimeoutActive) {
      return
    }

    this.inactivityTimeoutActive = true

    this.inactivityTimeoutInterval = setTimeout(() => {
      if (this.callState.isAttemptingToReconnect && this.callState.callId) {
        this.store.dispatch(
          new UpdateCallStatusToEnded({ callId: this.callState.callId })
        )
        this.store.dispatch(new HangUp())
        this.store.dispatch(new SetAttemptingReconnect(false))
      }

      this.inactivityTimeoutActive = false
    }, this.inactivityTimeout)
  }

  private startFollowingPointer() {
    document.body.addEventListener('mousemove', this.moveWindowToPointer)
    document.body.addEventListener('mouseup', this.stopFollowingPointer)
  }

  private stopFollowingPointer($event: MouseEvent) {
    document.body.removeEventListener('mousemove', this.moveWindowToPointer)
    document.body.removeEventListener('mouseup', this.stopFollowingPointer)
    const sticky =
      this.checkStickyAreas({ x: $event.clientX, y: $event.clientY }) ||
      this.stickyAreas[2]

    this.fixWindow(sticky)

    this.store.dispatch(new CallActions.ToggleDrag(sticky))
  }

  private stopRingingInterval() {
    if (!this.ringingCountdownInterval) {
      return
    }

    clearInterval(this.ringingCountdownInterval)
    this.ringingCountdownInterval = null
  }
}
