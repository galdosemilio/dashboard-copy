import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { createLocalAudioTrack, LocalAudioTrack } from 'twilio-video'

export interface MicLevelIndicatorState {
  analyser?: AnalyserNode
  analyserInterval?: number
  microphone?: MediaStreamAudioSourceNode
  track?: LocalAudioTrack
}

@Component({
  selector: 'ccr-mic-level-indicator',
  templateUrl: './mic-level-indicator.component.html',
  styleUrls: ['./mic-level-indicator.component.scss']
})
export class CcrMicLevelIndicatorComponent implements OnDestroy, OnInit {
  @Input() set deviceId(id: string) {
    this._deviceId = id

    if (id) {
      this.refreshAudioPreview()
    } else {
      this.disableAudioPreview()
    }
  }

  get deviceId(): string {
    return this._deviceId
  }

  public micBlocks: void[] = []
  public state: MicLevelIndicatorState = {}

  private _deviceId: string
  private micBlocksElements: HTMLDivElement[] = []
  private MIC_BLOCKS_AMOUNT = 10

  public ngOnDestroy(): void {
    this.disableAudioPreview()
  }

  public ngOnInit(): void {
    this.micBlocks = new Array(this.MIC_BLOCKS_AMOUNT).fill('')
  }

  private disableAudioPreview() {
    if (!this.state.track) {
      return
    }
    clearInterval(this.state.analyserInterval)
    this.state.track.disable()
    this.state.track.stop()
    this.state.track
      .detach()
      .forEach((detachedElement) => detachedElement.remove())
    this.state.microphone.disconnect()
    this.state.analyser.disconnect()
    this.state = {}
  }

  private async refreshAudioPreview(): Promise<void> {
    if (!this.deviceId) {
      return
    }
    this.disableAudioPreview()
    const track = await createLocalAudioTrack({
      name: this.deviceId
    })
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const microphone = audioContext.createMediaStreamSource(
      new MediaStream([track.mediaStreamTrack])
    )

    analyser.smoothingTimeConstant = 0.8
    analyser.fftSize = 512
    microphone.connect(analyser)

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    this.state.analyserInterval = setInterval(() => {
      analyser.getByteFrequencyData(dataArray)
      const average = dataArray.reduce(
        (prev, current, index, array) =>
          prev + current / array.length / this.micBlocks.length,
        0
      )

      if (!this.micBlocksElements?.length) {
        this.micBlocksElements = Array.from(
          document.querySelectorAll('.mic-block')
        )
      }

      this.micBlocksElements.forEach((element) => {
        element.classList.remove('active')
      })

      const activeMicBlocks = this.micBlocksElements.slice(0, average)

      activeMicBlocks.forEach((element) => element.classList.add('active'))
    }, 30)

    this.state = {
      ...this.state,
      track: track,
      microphone: microphone,
      analyser: analyser
    }
  }
}
