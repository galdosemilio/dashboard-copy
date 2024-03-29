import { Injectable } from '@angular/core'
import { TwilioBandwidthService } from '@app/layout/call/services/twilio-bandwidth.service'
import { Interaction } from '@coachcare/sdk'
import { BehaviorSubject, from, Observable, of } from 'rxjs'

import {
  connect,
  createLocalAudioTrack,
  createLocalTracks,
  createLocalVideoTrack
} from 'twilio-video'

import { CreateCallTokenRequest, CreateCallTokenResponse } from '@coachcare/sdk'

import { LoggingService, NotifierService } from '@app/service'
import { DeviceDetectorService } from 'ngx-device-detector'
import { CallTrack } from '../model'

export interface TwilioConfiguration {
  enableAudio: boolean
  enableVideo: boolean
  videoInputDevice?: string
  audioInputDevice?: string
  audioOutputDevice?: string
  authenticationToken: string
  roomName: string
  videoBackgroundEnabled: boolean
  videoBackgroundUrl: string
}

export interface ParticipantIdentifier {
  id: string
  name: string
}

export const BROWSER_TYPES = {
  CHROME: 'chrome',
  EDGE: 'edge',
  EDGE_CHROMIUM: 'ms-edge-chromium',
  INTERNET_EXPLORER: 'ie',
  FIREFOX: 'firefox',
  OPERA: 'opera',
  SAFARI: 'safari',
  UNKNOWN: 'unknown'
}

interface EnableCameraArgs {
  backgroundUrl: string
  backgroundEnabled: boolean
}

@Injectable()
export class TwilioService {
  public localTracks = null
  public localVideoTrack = null
  public localAudioTrack = null
  public currentRoom = null
  public localVideoEnabled = false
  public localAudioEnabled = false
  public generatedLocalTracks = false

  public remoteAudioMediaElementId = 'remote-audio-media'
  public remoteVideoMediaElementId = 'remote-video-media'
  public localAudioMediaElementId = 'local-audio-media'
  public localVideoMediaElementId = 'local-video-media'

  private participants = []
  private remoteSpeakerAudios = []
  private participantVideoTrackIds = []

  private selectedAudioInputDevice = ''
  private selectedAudioOutputDevice = ''
  private selectedVideoInputDevice = ''

  private configuration: TwilioConfiguration
  private ringingAudio
  private ringingPollInterval
  private callEndingAudio

  public participantConnected$ = new BehaviorSubject<string>('')
  public participantDisconnected$ = new BehaviorSubject<string>('')
  public trackAdded$ = new BehaviorSubject<string>('')
  public trackEnabled$ = new BehaviorSubject<string>('')
  public trackRemoved$ = new BehaviorSubject<string>('')
  public trackDisabled$ = new BehaviorSubject<string>('')
  public videoStarted$ = new BehaviorSubject<string>('')
  public videoStopped$ = new BehaviorSubject<string>('')

  constructor(
    private interaction: Interaction,
    private logging: LoggingService,
    private deviceService: DeviceDetectorService,
    private notifier: NotifierService,
    private twilioBandwidthService: TwilioBandwidthService
  ) {
    this.onParticipantConnected = this.onParticipantConnected.bind(this)
    this.trackEnabled$.subscribe((participant) =>
      this.participantVideoTrackIds.push(participant)
    )
    this.trackDisabled$.subscribe((participant) => {
      if (
        this.participantVideoTrackIds &&
        this.participantVideoTrackIds.length
      ) {
        this.participantVideoTrackIds = this.participantVideoTrackIds.filter(
          (pVT) => pVT !== participant
        )
      }
    })

    this.ringingAudio = new Audio('assets/phone-ring.mp3')
    this.callEndingAudio = new Audio('assets/call-end.mp3')
  }

  initialize(
    callTokenRequest: CreateCallTokenRequest
  ): Observable<CreateCallTokenResponse> {
    return from(this.interaction.createCallToken(callTokenRequest))
  }

  setActiveRoom(room) {
    this.currentRoom = room
  }

  getDeviceInfo() {
    return this.deviceService.getDeviceInfo()
  }

  // FIXME: this needs to moved out of twilio service
  getDevicesOfKind(deviceInfos, kind) {
    return deviceInfos.filter(function (deviceInfo) {
      return deviceInfo.kind === kind
    })
  }

  getDeviceSelectionOptions(): Observable<MediaDeviceInfo[]> {
    return from(navigator.mediaDevices.enumerateDevices())
  }

  createRoomName(accountId): string {
    return `${accountId}-${new Date().getTime()}`
  }

  generateLocalTracks(
    twilioConfiguration: TwilioConfiguration
  ): Observable<any> {
    this.configuration = twilioConfiguration
    this.selectedAudioInputDevice = twilioConfiguration.audioInputDevice
    this.selectedAudioOutputDevice = twilioConfiguration.audioOutputDevice
    this.selectedVideoInputDevice = twilioConfiguration.videoInputDevice

    if (this.generatedLocalTracks) {
      return of({ status: 'ok' })
    }

    this.generatedLocalTracks = true

    const audioDeviceSetting = this.selectedAudioInputDevice
      ? {
          deviceId: this.selectedAudioInputDevice
        }
      : true
    const videoDeviceSetting = this.selectedVideoInputDevice
      ? {
          deviceId: this.selectedVideoInputDevice
        }
      : true

    return from(
      createLocalTracks({
        audio: twilioConfiguration.enableAudio ? audioDeviceSetting : false,
        video: twilioConfiguration.enableVideo ? videoDeviceSetting : false
      }).then((localTracks) => {
        this.localTracks = localTracks
        this.localAudioTrack = this.getDevicesOfKind(localTracks, 'audio')[0]
        if (this.configuration.enableVideo) {
          this.localVideoTrack = this.getDevicesOfKind(localTracks, 'video')[0]
        }
        this.attachLocalTracks(twilioConfiguration)
        return { status: 'ok' }
      })
    )
  }

  createRoom(): Observable<any> {
    const self = this
    return from(
      connect(self.configuration.authenticationToken, {
        name: self.configuration.roomName,
        tracks: self.localTracks,
        preferredVideoCodecs: ['H264'],
        preferredAudioCodecs: ['isac']
      })
        .then((room) => {
          self.currentRoom = room

          // Calculate bandwidth by polling
          self.twilioBandwidthService.monitorRoom(self.currentRoom)

          // Connect the Tracks of the Room's Participants.
          self.connectAvailableParticipants()

          // When a Participant joins the Room, log the event.
          self.currentRoom.on(
            'participantConnected',
            this.onParticipantConnected
          )

          // When a Participant leaves the Room, detach its Tracks.
          this.currentRoom.on('participantDisconnected', (participant) => {
            if (this.participants && this.participants.length) {
              this.participants = this.participants.filter(
                (part) => part.identity !== participant.identity
              )
            }
            self.participantDisconnected$.next(participant.identity)

            const audioContainer = document.getElementById(
              this.remoteAudioMediaElementId
            )
            const videoContainer = document.getElementById(
              this.remoteVideoMediaElementId
            )

            if (audioContainer) {
              while (audioContainer.firstChild) {
                audioContainer.removeChild(audioContainer.lastChild)
              }
            }

            if (videoContainer) {
              const videoElements = videoContainer.getElementsByTagName('video')
              while (videoElements.length) {
                videoContainer.removeChild(videoElements.item(0))
              }
            }
          })

          // Once the LocalParticipant leaves the room, detach the Tracks
          // of all Participants, including that of the LocalParticipant.
          this.currentRoom.on('disconnected', (r) => {
            this.stopRingingPoll()
            this.twilioBandwidthService.stopMonitoringRoom()
            r.localParticipant.tracks.forEach((publication) => {
              if (publication.track.kind === 'data') {
                return
              }

              const attachedElements = publication.track.detach()
              attachedElements.forEach((element) => element.remove())
            })

            this.generatedLocalTracks = false
          })
          return { status: 'ok' }
        })
        .catch((error) => console.error(error))
    )
  }

  disableCamera() {
    if (this.localVideoTrack) {
      this.localVideoTrack.disable()
      this.localVideoTrack.stop()

      if (this.currentRoom) {
        this.currentRoom.localParticipant.videoTracks.forEach((publication) => {
          const track = publication.track
          this.currentRoom.localParticipant.unpublishTrack(track)

          track.detach().forEach(function (detachedElement) {
            detachedElement.remove()
          })
        })
      }
    }
    this.localVideoTrack = null
    this.localVideoEnabled = false
  }

  async enableCamera(
    args: EnableCameraArgs = { backgroundEnabled: false, backgroundUrl: '' }
  ) {
    if (this.currentRoom?.localParticipant === undefined) {
      return
    }

    this.localVideoEnabled = true

    const track = await createLocalVideoTrack({
      deviceId: this.selectedVideoInputDevice
    })

    await this.currentRoom.localParticipant.publishTrack(track)

    if (!this.localVideoEnabled) {
      // prevent race condition for disable/enable camera
      await this.currentRoom.localParticipant.unpublishTrack(track)
      track.disable()
      track.stop()
      track.detach()

      return
    }

    this.localVideoTrack = track

    const container = document.getElementById(this.localVideoMediaElementId)
    const element = this.localVideoTrack.attach()
    element.style.height = '100%'
    container.appendChild(element)

    await this.applyVideoBackground(args.backgroundEnabled, args.backgroundUrl)
  }

  async applyVideoBackground(
    backgroundEnabled: boolean,
    backgroundUrl?: string
  ) {
    if (!this.localVideoTrack) {
      return
    }

    if (this.localVideoTrack.processor) {
      await this.localVideoTrack.removeProcessor(this.localVideoTrack.processor)
    }

    if (backgroundEnabled) {
      await this.addBackgroundToVideoTrack(this.localVideoTrack, backgroundUrl)
      await this.currentRoom.localParticipant.unpublishTrack(
        this.localVideoTrack
      )
      await this.currentRoom.localParticipant.publishTrack(this.localVideoTrack)
    }
  }

  disableMicrophone() {
    if (this.localAudioTrack) {
      this.localAudioTrack.disable()
      this.localAudioTrack.stop()

      if (this.currentRoom && this.currentRoom.localParticipant) {
        this.currentRoom.localParticipant.audioTracks.forEach((publication) => {
          const track = publication.track
          this.currentRoom.localParticipant.unpublishTrack(track)

          track.detach().forEach(function (detachedElement) {
            detachedElement.remove()
          })
        })
      }
      this.localAudioTrack = null
    }
    this.localAudioEnabled = false
  }

  async enableMicrophone() {
    if (this.currentRoom?.localParticipant === undefined) {
      return
    }

    this.localAudioEnabled = true

    const track = await createLocalAudioTrack({
      deviceId: this.selectedAudioInputDevice
    })

    await this.currentRoom.localParticipant.publishTrack(track)

    if (!this.localAudioEnabled) {
      // prevent race condition for disable/enable audio
      await this.currentRoom.localParticipant.unpublishTrack(track)
      track.disable()
      track.stop()
      track.detach()

      return
    }

    this.localAudioTrack = track
    const container = document.getElementById(this.localAudioMediaElementId)
    container.appendChild(track.attach())
  }

  applyCamera(deviceId) {
    if (deviceId !== this.selectedVideoInputDevice) {
      this.selectedVideoInputDevice = deviceId
      this.disableCamera()
      void this.enableCamera()
    }
  }

  applyMicrophone(deviceId) {
    if (deviceId !== this.selectedAudioInputDevice) {
      this.selectedAudioInputDevice = deviceId
      this.disableMicrophone()
      void this.enableMicrophone()
    }
  }

  applySpeakers(deviceId) {
    if (deviceId !== this.selectedAudioOutputDevice) {
      this.selectedAudioOutputDevice = deviceId
      if (this.remoteSpeakerAudios && this.remoteSpeakerAudios.length) {
        this.remoteSpeakerAudios.forEach((remoteAudio) =>
          remoteAudio.setSinkId(this.selectedAudioOutputDevice)
        )
      }
    }
  }

  reinitialize(twilioConfiguration: Partial<TwilioConfiguration>) {
    this.attachLocalTracks(twilioConfiguration)
    this.attachAvailableParticipants()
  }

  // attach local (current user) tracks on DOM element
  attachLocalTracks(twilioConfiguration: Partial<TwilioConfiguration>) {
    const audioContainer = document.getElementById(
      this.localAudioMediaElementId
    )
    const videoContainer = document.getElementById(
      this.localVideoMediaElementId
    )

    if (this.localAudioTrack) {
      this.attachTrack({ track: this.localAudioTrack }, audioContainer)
    }
    if (this.localVideoTrack) {
      this.attachTrack({ track: this.localVideoTrack }, videoContainer)
    }
  }

  attachTrack(publication, container) {
    if (container && !publication.track.isStopped) {
      const videoElements = container.getElementsByTagName('video')
      while (videoElements.length) {
        container.removeChild(videoElements.item(0))
      }

      const audioElements = container.getElementsByTagName('audio')
      while (audioElements.length) {
        container.removeChild(audioElements.item(0))
      }

      const element = publication.track.attach()
      element.style.height = '100%'

      container.appendChild(element)
    }
  }

  // connect current participants
  connectAvailableParticipants() {
    this.currentRoom.participants.forEach(this.onParticipantConnected)
  }

  // attach current participants on DOM element
  attachAvailableParticipants() {
    this.currentRoom.participants.forEach((participant) => {
      participant.tracks.forEach((publication) => {
        if (publication.isSubscribed) {
          this.attachParticipantTrack(publication, participant)
        }
      })
    })
  }

  // attach new participant on DOM element
  attachParticipantTrack(publication, participant) {
    const track = publication.track
    const self = this
    const container = document.getElementById(
      track.kind === 'audio'
        ? this.remoteAudioMediaElementId
        : this.remoteVideoMediaElementId
    )

    if (track.kind !== 'data') {
      this.attachTrack(publication, container)
    }

    if (track.kind === 'video') {
      if (track.isEnabled) {
        self.trackEnabled$.next(participant.identity)
      } else {
        self.trackDisabled$.next(participant.identity)
      }

      track.on('enabled', function () {
        self.trackEnabled$.next(participant.identity)
      })
      track.on('disabled', function () {
        self.trackDisabled$.next(participant.identity)
      })
    }
  }

  // Detach the Room's Tracks from the DOM.
  disconnect() {
    // Detach Participant tracks if room is initialized
    if (this.localAudioTrack) {
      this.localAudioTrack.stop()
    }
    if (this.localVideoTrack) {
      this.localVideoTrack.stop()
    }

    this.stopRingingPoll()

    if (this.currentRoom) {
      this.currentRoom.disconnect()
      this.currentRoom = null
      return
    }

    if (this.localTracks) {
      this.localTracks = []
      this.localVideoTrack = null
      this.localAudioTrack = null
    }

    this.localVideoEnabled = false
    this.localAudioEnabled = false
    this.generatedLocalTracks = false
  }

  public hideVideoContainer(sid: string) {
    // this assumes only one remote
    const participant = this.participants[0]
    if (participant) {
      this.videoStopped$.next(participant.identity)
    }
  }

  public setRemoteConnSkips(): void {
    this.twilioBandwidthService.setRemoteConnSkips()
  }

  public showVideoContainer(sid: string) {
    // this assumes only one remote
    const participant = this.participants[0]
    const participantVideoTrack = this.participantVideoTrackIds.find(
      (pVT) => pVT === participant.identity
    )

    if (participant && participantVideoTrack) {
      this.videoStarted$.next(participant.identity)
    }
  }

  private onParticipantConnected(participant) {
    if (!this.participants.some((p) => p.identity === participant.identity)) {
      this.participants.push(participant)
    }

    this.participantConnected$.next(participant.identity)

    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed) {
        this.attachParticipantTrack(publication, participant)
      }
    })

    participant.on('trackSubscribed', (track) => {
      void this.logging.log({
        logLevel: 'info',
        data: {
          type: 'videoconferencing',
          functionType: 'attach-participant-track',
          message: 'attaching participant track',
          track: track.kind,
          participant: participant.identity
        }
      })

      this.attachParticipantTrack({ track }, participant)

      if (track.kind === 'video') {
        track.on('enabled', () => {
          this.videoStarted$.next(participant.identity)
          this.trackEnabled$.next(participant.identity)
        })

        track.on('started', () => {
          this.videoStarted$.next(participant.identity)
        })

        this.trackAdded$.next(participant.identity)
      }

      if (track.kind === 'audio') {
        try {
          const audioElement = track.attach()
          this.remoteSpeakerAudios.push(audioElement)
          audioElement.setSinkId(this.selectedAudioOutputDevice)
          document.body.appendChild(audioElement)
        } catch (error) {}
      }

      if (track.kind === 'data') {
        track.on('message', (message) =>
          this.twilioBandwidthService.onMessageReceived(message)
        )
      }
    })

    participant.on('trackUnsubscribed', (track) => {
      void this.logging.log({
        logLevel: 'info',
        data: {
          type: 'videoconferencing',
          functionType: 'detach-participant-track',
          message: 'detaching participant tracks',
          track: track.kind,
          participant: participant.identity
        }
      })
      if (track.kind === 'video') {
        this.videoStopped$.next(participant.identity)
        this.trackDisabled$.next(participant.identity)
      }
    })
  }

  public playRinging() {
    this.startRingingPoll()
    if (typeof this.ringingAudio.loop === 'boolean') {
      this.ringingAudio.loop = true
    } else {
      this.ringingAudio.addEventListener(
        'ended',
        function () {
          this.currentTime = 0
          this.play()
        },
        false
      )
    }
    this.ringingAudio.play()
  }

  public stopRinging() {
    this.stopRingingPoll()

    if (this.ringingAudio) {
      this.ringingAudio.pause()
      this.ringingAudio.currentTime = 0
    }
  }

  public playCallEnding() {
    this.stopRingingPoll()

    this.callEndingAudio.play()
  }

  public stopCallEnding() {
    if (this.callEndingAudio) {
      this.callEndingAudio.pause()
      this.callEndingAudio.currentTime = 0
    }
  }

  private async addBackgroundToVideoTrack(
    track,
    backgroundUrl: string
  ): Promise<void> {
    try {
      const callBackgroundUrl = backgroundUrl || 'assets/img/callwallpaper.png'

      await CallTrack.attachBackgroundToTrack(track, callBackgroundUrl)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private startRingingPoll() {
    if (this.ringingPollInterval) {
      return
    }

    this.ringingPollInterval = setInterval(() => {
      if (this.currentRoom && this.currentRoom.participants.length > 1) {
        this.stopRinging()
      }
    }, 1000)
  }

  private stopRingingPoll() {
    if (this.ringingPollInterval) {
      clearInterval(this.ringingPollInterval)
      this.ringingPollInterval = undefined
    }
  }
}
