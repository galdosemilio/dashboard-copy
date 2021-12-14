import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { UIState } from '@app/layout/store'
import {
  ApplySelectedAudioDevice,
  ApplySelectedAudioOutputDevice,
  ApplySelectedVideoDevice,
  callSelector,
  CallState,
  CheckDevices,
  CloseCallSettings,
  FetchDevices
} from '@app/layout/store/call'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { select, Store } from '@ngrx/store'
import { DeviceInfo } from 'ngx-device-detector'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { createLocalVideoTrack, LocalVideoTrack } from 'twilio-video'
import { BROWSER_TYPES, TwilioService } from '../../services/twilio.service'

@UntilDestroy()
@Component({
  selector: 'ccr-call-settings-form',
  templateUrl: './call-settings-form.component.html',
  styleUrls: ['./call-settings-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CcrCallSettingsFormComponent implements OnDestroy, OnInit {
  @Input() mode: 'settings-modal' | 'waiting-room' = 'settings-modal'

  @Output()
  videoTrack$: Subject<LocalVideoTrack> = new Subject<LocalVideoTrack>()

  @ViewChild('videoPreview', { static: true }) videoPreview

  BROWSER_TYPES = BROWSER_TYPES
  callState: CallState
  canPlaySound = false
  deviceHelpLinks = {
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
      audio: ''
    }
  }
  deviceInfo: DeviceInfo
  form: FormGroup
  previewState = {
    video: {
      deviceId: '',
      enabled: false,
      track: undefined
    },
    audio: {
      deviceId: ''
    },
    audioOutput: {
      deviceId: '',
      enabled: true
    }
  }
  testAudioSound
  formValueChangesSub

  private onApply$: Subject<void> = new Subject<void>()

  constructor(
    private builder: FormBuilder,
    private store: Store<UIState>,
    private twilio: TwilioService
  ) {
    this.onApply = this.onApply.bind(this)

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
    this.formValueChangesSub.unsubscribe()
  }

  ngOnInit() {
    // Whenever a media device is added or removed, update the list.
    navigator.mediaDevices.ondevicechange = () => {
      this.store.dispatch(new FetchDevices(false))
    }

    if (this.mode === 'waiting-room') {
      this.onApply$
        .pipe(debounceTime(1000), untilDestroyed(this))
        .subscribe(this.onApply)
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

    this.formValueChangesSub = this.form.valueChanges
      .pipe(untilDestroyed(this), debounceTime(300))
      .subscribe((controls) => {
        void this.updateVideoPreview(controls.selectedVideoInputDevice)
        void this.updateAudioPreview(controls.selectedAudioInputDevice)
        this.previewState.audioOutput.deviceId =
          controls.selectedAudioOutputDevice
        this.onApply$.next()
      })

    this.form.patchValue({
      selectedAudioInputDevice: this.callState.selectedAudioInputDevice,
      selectedVideoInputDevice: this.callState.selectedVideoInputDevice,
      selectedAudioOutputDevice: this.callState.selectedAudioOutputDevice
    })
  }

  onApply() {
    const closeSettings = this.mode === 'settings-modal'
    if (
      this.callState.selectedAudioInputDevice !==
      this.form.value.selectedAudioInputDevice
    ) {
      this.store.dispatch(
        new ApplySelectedAudioDevice({
          deviceId: this.form.value.selectedAudioInputDevice,
          closeSettings
        })
      )
    }
    if (
      this.callState.selectedVideoInputDevice !==
      this.form.value.selectedVideoInputDevice
    ) {
      this.store.dispatch(
        new ApplySelectedVideoDevice({
          deviceId: this.form.value.selectedVideoInputDevice,
          closeSettings
        })
      )
    }
    if (
      this.callState.selectedAudioOutputDevice !==
      this.form.value.selectedAudioOutputDevice
    ) {
      this.store.dispatch(
        new ApplySelectedAudioOutputDevice({
          deviceId: this.form.value.selectedAudioOutputDevice,
          closeSettings
        })
      )
    }

    if (this.mode === 'waiting-room') {
      return
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
    if (!this.previewState.video.enabled || !this.previewState.video.track) {
      return
    }

    this.previewState.video.track.disable()
    this.previewState.video.track.stop()
    this.previewState.video.track
      .detach()
      .forEach((detachedElement) => detachedElement.remove())
  }

  private disableAudioPreview() {
    this.previewState.audio = {
      deviceId: ''
    }
  }

  private async updateAudioPreview(deviceId?: string) {
    if (!deviceId) {
      return
    }

    this.previewState.audio.deviceId = deviceId
  }

  private async updateVideoPreview(deviceId: string) {
    if (!deviceId || this.previewState.video.deviceId === deviceId) {
      return
    }

    this.previewState.video.deviceId = deviceId
    this.disableVideoPreview()
    const track = await createLocalVideoTrack({
      name: deviceId
    })
    const element = track.attach()
    element.style.width = '100%'
    element.style.height = 'auto'
    element.setAttribute('muted', 'true')
    this.videoPreview.nativeElement.appendChild(element)
    this.previewState.video.enabled = true
    this.previewState.video.track = track
    this.videoTrack$.next(track)
  }
}
