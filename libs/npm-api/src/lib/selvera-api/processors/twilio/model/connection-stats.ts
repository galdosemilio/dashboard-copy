export enum ConnectionStatus {
  EXCELLENT,
  OK,
  BAD,
  IDLE,
  LOST,
  REFOCUS,
  NONE
}

export enum TwilioAudioCodec {
  ISAC,
  NONE
}

export enum TwilioVideoCodec {
  H264,
  NONE,
  VP8,
  VP9
}

export interface RawConnectionStats {
  id: string
  audioCodec: TwilioAudioCodec
  deltaBytesReceived: number
  deltaBytesSent: number
  bytesReceived: number
  bytesSent: number
  timestamp: number
  videoCodec: TwilioVideoCodec
}

export interface ConnectionStatOptions {
  allConnectionStats: ConnectionStats[]
  connectionStatsHistory: ConnectionStats[]
  forceMobileVideoEnabledState?: boolean
  isLocal: boolean
}

export class ConnectionStats {
  public hasMobileVideoEnabled: boolean
  public readonly id: string
  public readonly isLocal: boolean
  public readonly jitter: number
  public readonly qualityIndex: number
  public readonly raw: RawConnectionStats
  public readonly speed: number
  public set status(s: ConnectionStatus) {
    if (
      this._status === ConnectionStatus.IDLE &&
      s !== ConnectionStatus.REFOCUS
    ) {
      return
    }

    this._status = s
  }

  public get status(): ConnectionStatus {
    return this._status
  }

  public timestamp: number

  private _status: ConnectionStatus
  private CONNECTION_STATS_MAX_LIFE = 15000

  public constructor(
    raw: RawConnectionStats,
    opts: ConnectionStatOptions = {
      allConnectionStats: [],
      connectionStatsHistory: [],
      forceMobileVideoEnabledState: false,
      isLocal: false
    }
  ) {
    this.hasMobileVideoEnabled = this.resolveMobileVideoState(opts)
    this.id = raw.id
    this.raw = raw
    this.isLocal = opts.isLocal || false
    this.qualityIndex = this.calculateQualityIndex(opts.allConnectionStats)
    this.jitter = 0
    this.speed = this.calculateSpeed(opts.connectionStatsHistory)
    this.status = this.calculateStatus()
    this.timestamp = raw.timestamp || Date.now()
  }

  private calculateQualityIndex(allConnectionStats: ConnectionStats[]): number {
    let qualityIndex = 0

    allConnectionStats.forEach((connectionStats) => {
      const remotes = allConnectionStats.filter(
        (cS) => cS.id !== connectionStats.id
      )

      const cumulativeSent = remotes
        .map((remote) => remote.raw.bytesSent || 0)
        .reduce((prev, next) => prev + next, 0)

      qualityIndex = Math.round(
        (connectionStats.raw.bytesReceived / cumulativeSent) * 100
      )

      if (qualityIndex > 100) {
        qualityIndex = 100
      }
    })

    return qualityIndex
  }

  private calculateSpeed(connectionStatsHistory: ConnectionStats[]): number {
    let speed = 0

    if (connectionStatsHistory.length > 1) {
      const previous = connectionStatsHistory[connectionStatsHistory.length - 2]

      // we calculate the nominal speed
      speed =
        this.raw.bytesSent === previous.raw.bytesSent
          ? previous.speed > 0
            ? previous.speed
            : 0
          : this.raw.bytesSent - previous.raw.bytesSent

      // then we get the mean value
      speed = Math.round(
        connectionStatsHistory
          .map((cSH) => cSH.speed)
          .reduce((prev, next) => prev + next, 0) /
          connectionStatsHistory.length
      )
    } else {
      speed = this.raw.bytesSent
    }

    return speed
  }

  private calculateStatus(): ConnectionStatus {
    let status: ConnectionStatus

    if (this.qualityIndex >= 35) {
      status =
        this.qualityIndex >= 75
          ? ConnectionStatus.EXCELLENT
          : ConnectionStatus.OK
    } else {
      status = ConnectionStatus.BAD
    }

    status = !(Date.now() - this.timestamp >= this.CONNECTION_STATS_MAX_LIFE)
      ? status
      : ConnectionStatus.LOST

    return status
  }

  private resolveMobileVideoState(opts: ConnectionStatOptions): boolean {
    if (opts.forceMobileVideoEnabledState !== undefined) {
      return opts.forceMobileVideoEnabledState
    } else {
      return opts.connectionStatsHistory.length
        ? opts.connectionStatsHistory[opts.connectionStatsHistory.length - 1]
            .hasMobileVideoEnabled
        : false
    }
  }
}
