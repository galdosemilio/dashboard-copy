import { BillableService } from '@app/dashboard/reports/communications/models'

export const WindowState = {
  DEFAULT: 'DEFAULT',
  MINIMIZED: 'MINIMIZED',
  FULLSCREEN: 'FULLSCREEN'
}

export const ControlsState = {
  NONE: 'NONE',
  NOTIFYING: 'NOTIFYING',
  WAITING: 'WAITING',
  RECONNECTING: 'RECONNECTING',
  CALL_ON_GOING: 'CALL_ON_GOING'
}

export interface Person {
  id: string
  callIdentity: string
  name: string
  isParticipating: boolean
  isAvailable: boolean
  hasFetchedStatus: boolean
}

export interface RoomState {
  name: string
  organizationId: string
  initiatorId: string
  participants: Person[]
}

export interface CallEndState {
  opened: number
  ended: number
}

export interface CallState {
  billableService: BillableService
  isSupported: boolean
  isExpected: boolean
  isCallStarted: boolean
  isReconnect: boolean
  twilioToken: string
  source: string
  callId: string
  callUserId: string
  conferencingEnabled: boolean
  subaccountId: string
  participantJoined: boolean
  windowState: string
  controlsState: string
  isCheckingDeviceAccess: boolean
  hasAudioDeviceAccess: boolean
  hasVideoDeviceAccess: boolean
  hasVideoStarted: boolean
  isVideoStreamAvailable: boolean
  isCameraEnabled: boolean
  isRemoteVideoEnabled: boolean
  isLocalVideoEnabled: boolean
  isMicrophoneEnabled: boolean
  selectedAudioInputDevice: string
  selectedAudioOutputDevice: string
  selectedVideoInputDevice: string
  audioInputDevices: MediaDeviceInfo[]
  audioOutputDevices: MediaDeviceInfo[]
  videoInputDevices: MediaDeviceInfo[]
  room: RoomState
  hasEnteredRoom: boolean
  callEndState: CallEndState
  fetchDevicesSuccess: boolean
  isBeingDragged: boolean
  lastPosition: any
  isAttemptingToReconnect: boolean
  reconnectionBumper: boolean
}

export const initialRoom: RoomState = {
  name: '',
  organizationId: '',
  initiatorId: '',
  participants: []
}

export const initialCallEndState: CallEndState = {
  opened: 0,
  ended: 0
}

export const initialState: CallState = {
  billableService: {
    id: '',
    name: '',
    displayName: ''
  },
  isSupported: false,
  isExpected: false,
  isCallStarted: false,
  isReconnect: false,
  twilioToken: '',
  source: '',
  callId: '',
  callUserId: '',
  subaccountId: '',
  participantJoined: false,
  isCheckingDeviceAccess: false,
  hasAudioDeviceAccess: true,
  hasVideoDeviceAccess: true,
  windowState: WindowState.DEFAULT,
  controlsState: ControlsState.NONE,
  isVideoStreamAvailable: false,
  isCameraEnabled: false,
  hasVideoStarted: false,
  isRemoteVideoEnabled: false,
  isLocalVideoEnabled: false,
  isMicrophoneEnabled: true,
  room: initialRoom,
  selectedAudioInputDevice: '',
  selectedAudioOutputDevice: '',
  selectedVideoInputDevice: '',
  audioInputDevices: [],
  audioOutputDevices: [],
  videoInputDevices: [],
  hasEnteredRoom: false,
  callEndState: initialCallEndState,
  fetchDevicesSuccess: false,
  lastPosition: undefined,
  isBeingDragged: false,
  conferencingEnabled: false,
  isAttemptingToReconnect: false,
  reconnectionBumper: false
}
