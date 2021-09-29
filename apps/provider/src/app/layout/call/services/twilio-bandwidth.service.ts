import { Injectable } from '@angular/core'
import { ContextService, LoggingService } from '@app/service'
import {
  ConnectionStats,
  TwilioDataMessage,
  TwilioDataMessageType
} from '@coachcare/sdk'
import { Subject } from 'rxjs'
import { TwilioRoomMonitor } from '@coachcare/sdk'
import { LocalDataTrack, Room, StatsReport } from 'twilio-video'
import { Store } from '@ngrx/store'
import {
  callSelector,
  CallState,
  DisableCurrentUserCamera,
  EnableCurrentUserCamera
} from '@app/layout/store/call'
import { sleep } from '@app/shared/utils'

@Injectable()
export class TwilioBandwidthService {
  public currentRoom: Room = null
  public connectionUpdate$: Subject<ConnectionStats[]> = new Subject<
    ConnectionStats[]
  >()
  public listenToVideoDataTrack = false
  public currentRemoteConnSkips = 0

  private dataTrack: LocalDataTrack = null
  private dataTrackPublished: any = {}
  private roomMonitor: TwilioRoomMonitor
  private subscriptions = []
  private monitorPulse = 0
  private monitorInterval: any
  private monitorIntervalTimeout = 1000
  private readonly REMOTE_CONNECTIVITY_SKIPS: number = 5
  private callState: CallState

  constructor(
    private context: ContextService,
    private loggingService: LoggingService,
    private store: Store<CallState>
  ) {
    this.onMessageReceived = this.onMessageReceived.bind(this)

    this.store
      .select(callSelector)
      .subscribe((state) => (this.callState = state))
  }

  public monitorRoom(room: Room): void {
    this.currentRoom = room
    this.setupDataTracks()
    this.roomMonitor = new TwilioRoomMonitor(this.loggingService.getProvider())
    this.roomMonitor.init({
      userId: this.context.user.id,
      appType: this.loggingService.app
    })
    this.subscriptions = [
      this.roomMonitor.connectionUpdate$.subscribe((connectionStats) =>
        this.connectionUpdate$.next(connectionStats)
      ),
      this.roomMonitor.message$.subscribe((message) =>
        this.sendMessage(message)
      )
    ]

    this.monitorInterval = setInterval(async () => {
      ++this.monitorPulse
      const stats = await this.currentRoom.getStats()
      this.checkRoomStability(stats)
      this.roomMonitor.monitorRoomHandler(stats)
    }, this.monitorIntervalTimeout)
  }

  public async onMessageReceived(raw: string): Promise<void> {
    this.roomMonitor.onMessageReceived(raw)
    const message: TwilioDataMessage = JSON.parse(raw)

    switch (message.type) {
      case TwilioDataMessageType.MOB_CAM_OFF:
      case TwilioDataMessageType.MOB_CAM_ON:
        this.listenToVideoDataTrack = true
        break

      case TwilioDataMessageType.TOGGLE_CAM:
        if (!this.callState.isCameraEnabled) {
          return
        }
        // toggle the cam programatically
        this.store.dispatch(new DisableCurrentUserCamera())
        await sleep(1)
        this.store.dispatch(new EnableCurrentUserCamera())
        break
    }
  }

  public sendMobileCameraOffMessage(): void {
    this.roomMonitor.sendMobileCameraOffMessage()
  }

  public sendMobileCameraOnMessage(): void {
    this.roomMonitor.sendMobileCameraOnMessage()
  }

  public sendMobileOffMessage(): void {
    this.roomMonitor.sendMobileOffMessage()
  }

  public sendMobileOnMessage(): void {
    this.roomMonitor.sendMobileOnMessage()
  }

  public sendToggleCameraMessage(): void {
    this.roomMonitor.sendToggleCameraMessage()
  }

  public setRemoteConnSkips(): void {
    this.currentRemoteConnSkips = this.REMOTE_CONNECTIVITY_SKIPS
  }

  public stopMonitoringRoom(): void {
    if (!this.roomMonitor) {
      return
    }

    this.listenToVideoDataTrack = false
    clearInterval(this.monitorInterval)
    this.monitorPulse = 0
    this.roomMonitor.stopMonitoringRoom()
    this.unsubscribe()
  }

  private checkRoomStability(stats: StatsReport[]): void {
    const single = stats[0]

    if (single?.remoteVideoTrackStats?.length < 2) {
      return
    }

    if (this.monitorPulse > 0 && this.monitorPulse % 10 === 0) {
      this.sendToggleCameraMessage()
    }
  }

  private sendMessage(data: string): void {
    this.dataTrackPublished.promise.then(() => this.dataTrack.send(data))
  }

  private setupDataTracks(): void {
    this.dataTrack = new LocalDataTrack()
    this.currentRoom.localParticipant.publishTrack(this.dataTrack)

    this.dataTrackPublished.promise = new Promise((resolve, reject) => {
      this.dataTrackPublished.resolve = resolve
      this.dataTrackPublished.reject = reject
    })
    ;(this.currentRoom.localParticipant as any).on(
      'trackPublished',
      (publication) => {
        if (publication.track === this.dataTrack) {
          this.dataTrackPublished.resolve()
        }
      }
    )
    ;(this.currentRoom.localParticipant as any).on(
      'trackPublicationFailed',
      (error, track) => {
        if (track === this.dataTrack) {
          this.dataTrackPublished.reject(error)
        }
      }
    )
  }

  private unsubscribe(): void {
    this.subscriptions.forEach(
      (subscription) => subscription && subscription.unsubscribe()
    )
  }
}
