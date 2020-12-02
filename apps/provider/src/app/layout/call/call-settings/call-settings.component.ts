import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import {
  ApplySelectedAudioDevice,
  ApplySelectedAudioOutputDevice,
  ApplySelectedVideoDevice,
  CheckDevices,
  CloseCallSettings,
  FetchDevices
} from '@app/layout/store/call/call.action'
import { callSelector } from '@app/layout/store/call/call.selector'
import { CallState } from '@app/layout/store/call/call.state'
import { UIState } from '@app/layout/store/state'
import { select, Store } from '@ngrx/store'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime } from 'rxjs/operators'
import { createLocalAudioTrack, createLocalVideoTrack } from 'twilio-video'
import { BROWSER_TYPES, TwilioService } from '../services/twilio.service'

@UntilDestroy()
@Component({
  selector: 'app-call-settings',
  templateUrl: './call-settings.component.html',
  styleUrls: ['./call-settings.component.scss'],
  host: { class: 'ccr-dialog' }
})
export class CallSettingsComponent implements OnDestroy, OnInit {
  @ViewChild('videoPreview', { static: false }) videoPreview

  BROWSER_TYPES = BROWSER_TYPES
  callState: CallState
  canPlaySound = false
  deviceHelpLinks: any = {
    all: {
      firefox:
        'https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions',
      chrome: 'https://support.google.com/chrome/answer/2693767',
      safari:
        'https://support.apple.com/guide/safari/websites-ibrwe2159f50/mac',
      default: 'https://support.google.com/chrome/answer/2693767'
    },
    current: {
      video: '',
      audioInput: ''
    }
  }
  deviceInfo: any
  form: FormGroup
  filledMicBlocks = 0
  micBlocksAmount = 10
  micBlocks: any[] = []
  previewState: any = {
    video: {
      deviceId: '',
      enabled: false,
      track: undefined
    },
    audio: {
      analyser: undefined,
      analyserInterval: undefined,
      deviceId: '',
      enabled: false,
      microphone: undefined,
      track: undefined
    },
    audioOutput: {
      deviceId: '',
      enabled: true
    }
  }
  testAudioSound

  constructor(
    private builder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private store: Store<UIState>,
    private twilio: TwilioService
  ) {
    this.store.pipe(select(callSelector)).subscribe((callState) => {
      this.callState = callState
      this.canPlaySound =
        this.callState.audioOutputDevices &&
        this.callState.audioOutputDevices.length > 0
    })
  }

  ngOnDestroy() {
    this.disableAudioPreview()
    this.disableVideoPreview()
  }

  ngOnInit() {
    const self = this
    // Whenever a media device is added or removed, update the list.
    navigator.mediaDevices.ondevicechange = function () {
      self.store.dispatch(new FetchDevices(false))
    }

    this.createForm()
    this.store
      .pipe(select(callSelector), untilDestroyed(this))
      .subscribe((callState) => {
        const value = this.form.value
        this.form.patchValue({
          selectedAudioInputDevice:
            value.selectedAudioInputDevice ||
            callState.selectedAudioInputDevice,
          selectedVideoInputDevice:
            value.selectedVideoInputDevice ||
            callState.selectedVideoInputDevice,
          selectedAudioOutputDevice:
            value.selectedAudioOutputDevice ||
            callState.selectedAudioOutputDevice
        })
      })

    this.store.dispatch(new CheckDevices())

    this.testAudioSound = document.createElement('audio')
    this.testAudioSound.src = 'assets/phone-ring.mp3'
    this.testAudioSound.onended = () =>
      (this.canPlaySound =
        this.callState.audioOutputDevices &&
        this.callState.audioOutputDevices.length > 0)
    this.testAudioSound.onloadeddata = () =>
      (this.canPlaySound =
        this.callState.audioOutputDevices &&
        this.callState.audioOutputDevices.length > 0)
    this.testAudioSound.load()
    this.micBlocks = new Array(this.micBlocksAmount).fill(0)
    this.deviceInfo = this.twilio.getDeviceInfo()

    if (this.deviceInfo.browser.toLowerCase() === BROWSER_TYPES.FIREFOX) {
      this.previewState.audioOutput.enabled = false
    }

    const deviceHelpLink =
      this.deviceHelpLinks.all[this.deviceInfo.browser.toLowerCase()] ||
      this.deviceHelpLinks.all.default
    this.deviceHelpLinks.current.video = deviceHelpLink
    this.deviceHelpLinks.current.audio = deviceHelpLink
  }

  createForm() {
    this.form = this.builder.group({
      selectedAudioInputDevice: [],
      selectedVideoInputDevice: [],
      selectedAudioOutputDevice: []
    })

    this.form.valueChanges
      .pipe(untilDestroyed(this), debounceTime(300))
      .subscribe((controls) => {
        this.updateVideoPreview(controls.selectedVideoInputDevice)
        this.updateAudioPreview(controls.selectedAudioInputDevice)
        this.previewState.audioOutput.deviceId =
          controls.selectedAudioOutputDevice
      })

    this.form.patchValue({
      selectedAudioInputDevice: this.callState.selectedAudioInputDevice,
      selectedVideoInputDevice: this.callState.selectedVideoInputDevice,
      selectedAudioOutputDevice: this.callState.selectedAudioOutputDevice
    })
  }

  onClose() {
    this.store.dispatch(new CloseCallSettings())
  }

  onApply() {
    if (
      this.callState.selectedAudioInputDevice !==
      this.form.value.selectedAudioInputDevice
    ) {
      this.store.dispatch(
        new ApplySelectedAudioDevice(this.form.value.selectedAudioInputDevice)
      )
    }
    if (
      this.callState.selectedVideoInputDevice !==
      this.form.value.selectedVideoInputDevice
    ) {
      this.store.dispatch(
        new ApplySelectedVideoDevice(this.form.value.selectedVideoInputDevice)
      )
    }
    if (
      this.callState.selectedAudioOutputDevice !==
      this.form.value.selectedAudioOutputDevice
    ) {
      this.store.dispatch(
        new ApplySelectedAudioOutputDevice(
          this.form.value.selectedAudioOutputDevice
        )
      )
    }

    this.store.dispatch(new CloseCallSettings())
  }

  async onTestAudioOutput() {
    if (this.previewState.audioOutput.deviceId) {
      await this.testAudioSound.setSinkId(
        `${this.previewState.audioOutput.deviceId}`
      )
      this.canPlaySound = false
      this.testAudioSound.play()
    }
  }

  private disableVideoPreview() {
    if (this.previewState.video.enabled && this.previewState.video.track) {
      this.previewState.video.track.disable()
      this.previewState.video.track.stop()
      this.previewState.video.track
        .detach()
        .forEach((detachedElement) => detachedElement.remove())
    }
  }

  private disableAudioPreview() {
    if (this.previewState.audio.enabled && this.previewState.audio.track) {
      clearInterval(this.previewState.audio.analyserInterval)
      this.previewState.audio.track.disable()
      this.previewState.audio.track.stop()
      this.previewState.audio.track
        .detach()
        .forEach((detachedElement) => detachedElement.remove())
      this.previewState.audio.microphone.disconnect()
      this.previewState.audio.analyser.disconnect()
      this.previewState.audio = {
        enabled: false,
        track: undefined,
        microphone: undefined,
        analyser: undefined,
        analyserInterval: undefined
      }
    }
  }

  private async updateAudioPreview(deviceId: string) {
    if (deviceId && this.previewState.audio.deviceId !== deviceId) {
      this.disableAudioPreview()
      const track = await createLocalAudioTrack({
        name: deviceId
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

      this.previewState.audio.analyserInterval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce(
          (prev, current, index, array) =>
            prev + current / array.length / this.micBlocks.length,
          0
        )
        this.filledMicBlocks = average
        this.cdr.detectChanges()
      }, 300)

      this.previewState.audio = {
        ...this.previewState.audio,
        deviceId: deviceId,
        enabled: true,
        track: track,
        microphone: microphone,
        analyser: analyser
      }
    }
  }

  private async updateVideoPreview(deviceId: string) {
    if (deviceId && this.previewState.video.deviceId !== deviceId) {
      this.previewState.video.deviceId = deviceId
      this.disableVideoPreview()
      const track = await createLocalVideoTrack({
        name: deviceId
      })
      const element = track.attach()
      element.style.width = '200px'
      element.style.height = '150px'
      element.setAttribute('muted', 'true')
      this.videoPreview.nativeElement.appendChild(element)
      this.previewState.video.enabled = true
      this.previewState.video.track = track
    }
  }
}
