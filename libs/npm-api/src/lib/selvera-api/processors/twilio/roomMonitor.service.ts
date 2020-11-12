import { Subject, Subscription } from 'rxjs'
import { auditTime } from 'rxjs/operators'
import { Room, StatsReport } from 'twilio-video'
import { AddLogRequest } from '../../providers/logging/requests'
import { Logging } from '../../services'
import {
  ConnectionStats,
  ConnectionStatus,
  RawConnectionStats,
  TwilioAudioCodec,
  TwilioDataMessage,
  TwilioDataMessageType,
  TwilioVideoCodec
} from './model'

enum BandwidthEntryType {
  AudioLocal = 'localAudioTrackStats',
  AudioRemote = 'remoteAudioTrackStats',
  VideoLocal = 'localVideoTrackStats',
  VideoRemote = 'remoteVideoTrackStats'
}

export class TwilioRoomMonitor {
  public connectionUpdate$: Subject<ConnectionStats[]> = new Subject<
    ConnectionStats[]
  >()
  public currentRoom: Room
  public message$: Subject<string> = new Subject<string>()

  private allConnectionStats: ConnectionStats[] = []
  private appType: AddLogRequest['app']
  private connectionStatsHistory: ConnectionStats[][] = []
  private hasMobileVideoEnabled?: boolean
  private historyAmount = 5
  private id: string
  private loggingAuditTime = 5000
  private previousLoggedConnStats: ConnectionStats
  private previousRawStatsEntry: RawConnectionStats
  private roomPollingTime = 1000
  private roomStatPollInterval: any
  private stats: StatsReport[] = []
  private subscriptions: Subscription[] = []

  public constructor(private logging: Logging) {}

  public getAllConnectionStats(): ConnectionStats[] {
    return this.allConnectionStats.slice()
  }

  public getConnectionStats(id: string = this.id): ConnectionStats | undefined {
    const hit = this.allConnectionStats.find(
      (connectionStats) => connectionStats.id === id
    )

    return hit
  }

  public init(args: { userId: string; appType: AddLogRequest['app'] }): void {
    this.id = args.userId
    this.appType = args.appType
    this.subscriptions = [
      this.connectionUpdate$
        .pipe(auditTime(this.loggingAuditTime))
        .subscribe(async (connectionStats) => {
          try {
            await this.checkLocalConnectionForLogging(connectionStats)
          } catch (error) {
            // we fail silently
          }
        })
    ]
  }

  public monitorRoom(args: { userId: string; roomRef: Room }): void {
    this.reset()
    this.id = args.userId
    this.currentRoom = args.roomRef
    this.roomStatPollInterval = setInterval(async () => {
      this.monitorRoomHandler(await this.currentRoom.getStats())
    }, this.roomPollingTime)
  }

  public monitorRoomHandler(roomStats: StatsReport[]): void {
    this.stats = roomStats

    if (!this.stats[0]) {
      return
    }

    if (!this.previousRawStatsEntry) {
      this.previousRawStatsEntry = {
        id: this.id,
        audioCodec: TwilioAudioCodec.NONE,
        deltaBytesReceived: 0,
        deltaBytesSent: 0,
        bytesReceived: 0,
        bytesSent: 0,
        timestamp: Date.now(),
        videoCodec: TwilioVideoCodec.NONE
      }
    }

    const newStatsEntry: RawConnectionStats = {
      id: this.id,
      audioCodec: this.stats[0].localAudioTrackStats.length
        ? (this.stats[0].localAudioTrackStats[0].codec as any)
        : TwilioAudioCodec.NONE,
      deltaBytesReceived: 0,
      deltaBytesSent: 0,
      bytesReceived: 0,
      bytesSent: 0,
      timestamp: Date.now(),
      videoCodec: this.stats[0].localVideoTrackStats.length
        ? (this.stats[0].localVideoTrackStats[0].codec as any)
        : TwilioVideoCodec.NONE
    }

    Object.keys(BandwidthEntryType).forEach((key) => {
      const bytesType = key.includes('Remote') ? 'bytesReceived' : 'bytesSent'
      const type = (BandwidthEntryType as any)[key]

      if ((this.stats[0] as any)[type].length) {
        const statTypeEntries = (this.stats[0] as any)[type]

        statTypeEntries.forEach((stats: any) => {
          if (stats[bytesType]) {
            newStatsEntry[bytesType] += stats[bytesType]
          }
        })

        newStatsEntry.deltaBytesReceived =
          newStatsEntry.bytesReceived - this.previousRawStatsEntry.bytesReceived
        newStatsEntry.deltaBytesSent =
          newStatsEntry.bytesSent - this.previousRawStatsEntry.bytesSent
      }
    })

    const historyIndex = this.calculateConnStatsHistoryIndex(newStatsEntry)

    const connectionStats = new ConnectionStats(newStatsEntry, {
      allConnectionStats: this.allConnectionStats,
      connectionStatsHistory:
        historyIndex > -1 ? this.connectionStatsHistory[historyIndex] : [],
      forceMobileVideoEnabledState: this.hasMobileVideoEnabled,
      isLocal: true
    })
    this.upsertConnectionStats(connectionStats)

    this.previousRawStatsEntry = newStatsEntry
    this.message$.next(
      JSON.stringify({
        type: TwilioDataMessageType.TRACKING,
        data: newStatsEntry
      })
    )
  }

  public onMessageReceived(raw: string): void {
    const mess: TwilioDataMessage = JSON.parse(raw)
    let remoteConn

    switch (mess.type) {
      case TwilioDataMessageType.MOB_CAM_ON:
      case TwilioDataMessageType.MOB_CAM_OFF:
        remoteConn = this.allConnectionStats.find(
          (rC) => rC.id === mess.data.id
        )

        if (!remoteConn) {
          return
        }

        remoteConn.hasMobileVideoEnabled =
          mess.type === TwilioDataMessageType.MOB_CAM_ON ? true : false
        this.connectionUpdate$.next(this.allConnectionStats)
        break

      case TwilioDataMessageType.MOB_APP_OFF:
      case TwilioDataMessageType.MOB_APP_ON:
        remoteConn = this.allConnectionStats.find(
          (rC) => rC.id === mess.data.id
        )

        if (remoteConn) {
          remoteConn.status =
            mess.type === TwilioDataMessageType.MOB_APP_OFF
              ? ConnectionStatus.IDLE
              : mess.type === TwilioDataMessageType.MOB_APP_ON
              ? ConnectionStatus.REFOCUS
              : ConnectionStatus.NONE
        }

        this.connectionUpdate$.next(this.allConnectionStats)
        break

      case TwilioDataMessageType.TRACKING:
        const historyIndex = this.calculateConnStatsHistoryIndex(
          mess.data as RawConnectionStats
        )
        const newConnectionStats = new ConnectionStats(
          {
            ...mess.data,
            timestamp: Date.now()
          } as RawConnectionStats,
          {
            isLocal: false,
            allConnectionStats: this.allConnectionStats,
            connectionStatsHistory:
              historyIndex > -1 ? this.connectionStatsHistory[historyIndex] : []
          }
        )
        this.upsertConnectionStats(newConnectionStats)
        break
    }
  }

  public reset(): void {
    this.connectionStatsHistory = []
    this.allConnectionStats = []
    delete this.id
    delete this.previousRawStatsEntry
    delete this.stats
  }

  public sendMobileCameraOffMessage(): void {
    this.hasMobileVideoEnabled = false
    this.message$.next(
      JSON.stringify({
        type: TwilioDataMessageType.MOB_CAM_OFF,
        data: { id: this.id }
      })
    )
  }

  public sendMobileCameraOnMessage(): void {
    this.hasMobileVideoEnabled = true
    this.message$.next(
      JSON.stringify({
        type: TwilioDataMessageType.MOB_CAM_ON,
        data: { id: this.id }
      })
    )
  }

  public sendMobileOffMessage(): void {
    this.message$.next(
      JSON.stringify({
        type: TwilioDataMessageType.MOB_APP_OFF,
        data: { id: this.id }
      })
    )
  }

  public sendMobileOnMessage(): void {
    this.message$.next(
      JSON.stringify({
        type: TwilioDataMessageType.MOB_APP_ON,
        data: { id: this.id }
      })
    )
  }

  public stopMonitoringRoom(): void {
    this.reset()
    if (this.roomStatPollInterval) {
      clearInterval(this.roomStatPollInterval)
      this.roomStatPollInterval = null
    }

    if (!this.subscriptions || !this.subscriptions.length) {
      return
    }

    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe()
    })
  }

  private calculateConnStatsHistoryIndex(raw: RawConnectionStats): number {
    const index = this.connectionStatsHistory.findIndex(
      (connStatsHistory) => connStatsHistory[0].id === raw.id
    )
    return index
  }

  private async checkLocalConnectionForLogging(
    connectionStats: ConnectionStats[]
  ): Promise<void | Error> {
    try {
      const localConnStats = connectionStats.find(
        (connStats) => connStats.isLocal
      )
      if (
        !localConnStats ||
        (this.previousLoggedConnStats &&
          this.previousLoggedConnStats.status === localConnStats.status)
      ) {
        return
      }

      await this.logging.add({
        app: this.appType,
        logLevel: 'info',
        message: `${localConnStats.id} connection changed to ${localConnStats.status}`,
        keywords: [{ ...localConnStats }]
      })

      this.previousLoggedConnStats = localConnStats
    } catch (error) {
      return new Error(`[npm-api] Couldn't create log entry`)
    }
  }

  private upsertConnectionStatsHistory(connectionStats: ConnectionStats): void {
    const index = this.allConnectionStats.findIndex(
      (cS) => cS.id === connectionStats.id
    )

    if (index > -1) {
      if (!this.connectionStatsHistory[index]) {
        this.connectionStatsHistory[index] = []
      }

      this.connectionStatsHistory[index].push(connectionStats)

      if (this.connectionStatsHistory[index].length > this.historyAmount) {
        this.connectionStatsHistory[index].shift()
      }
    }
  }

  private upsertConnectionStats(newConnectionStats: ConnectionStats): void {
    const hitIndex = this.allConnectionStats.findIndex(
      (connectionStats) => connectionStats.id === newConnectionStats.id
    )

    if (hitIndex > -1) {
      if (this.allConnectionStats[hitIndex].status === ConnectionStatus.IDLE) {
        newConnectionStats.status = ConnectionStatus.IDLE
      }

      this.allConnectionStats[hitIndex] = newConnectionStats
    } else {
      this.allConnectionStats.push(newConnectionStats)
    }

    this.upsertConnectionStatsHistory(newConnectionStats)

    this.connectionUpdate$.next(this.allConnectionStats)
  }
}
