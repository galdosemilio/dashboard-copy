import { BillableService } from '@app/dashboard/reports/communications/models'
import { TwilioConfiguration } from '@app/layout/call/services/twilio.service'
import { CallEndState, RoomState } from '@app/layout/store/call/call.state'
import {
  Call,
  CreateCallInteractionRequest,
  CreateCallTokenRequest,
  FetchCallDetailsRequest,
  FetchCallDetailsResponse,
  FetchCallsRequest,
  UpdateCallRequest,
  VideoTokenResponse
} from '@coachcare/sdk'
import { Action } from '@ngrx/store'

/**
 * Action Types
 */
export const SET_CALL_IS_EXPECTED = 'CALL setting call being expected'
export const SET_CALL_IS_SUPPORTED = 'CALL function supported'
export const SET_CONFERENCING_ENABLED = 'CALL conferencing enabled'
export const INITIATE_CALL = 'CALL inititiate call'
export const RECEIVE_CALL = 'CALL receive call'
export const FETCH_TWILIO_TOKEN = 'CALL fetch twilio token'
export const FETCH_TWILIO_TOKEN_COMPLETE = 'CALL fetch twilio token complete'
export const FETCH_TWILIO_TOKEN_FAILED = 'CALL fetch twilio token failed'
export const CREATE_LOCAL_TRACKS = 'CALL twilio/create local tracks'
export const CREATE_LOCAL_TRACKS_COMPLETE =
  'CALL twilio/create local tracks complete'
export const CREATE_LOCAL_TRACKS_FAILED =
  'CALL twilio/create local tracks failed'
export const CREATE_ROOM = 'CALL twilio/create room'
export const CREATE_ROOM_SUCCESSFUL = 'CALL twilio/create room successful'
export const CREATE_ROOM_FAILED = 'CALL twilio/create room failed'
export const SAVE_CALL = 'CALL save call data'
export const SAVE_CALL_COMPLETE = 'CALL save call data succesful'
export const FETCH_CALL_DETAILS = 'CALL fetch call details'
export const FETCH_CALL_DETAILS_COMPLETE = 'CALL fetch call details successful'
export const UPDATE_CALL_STATUS_TO_ENDED = 'CALL update call status to ended'
export const FETCH_SUBACCOUNT = 'CALL fetch subaccount'
export const FETCH_SUBACCOUNT_COMPLETE = 'CALL fetch subaccount complete'
export const FETCH_SUBACCOUNT_FAILED = 'CALL fetch subaccount failed'
export const MINIMIZE_WINDOW = 'CALL minimize window'
export const ENTER_FULLSCREEN = 'CALL enter fullscreen'
export const NORMALIZE_WINDOW = 'CALL normalize window'
export const SHOW_INCOMING_CALL = 'CALL show incoming call'
export const SHOW_WAITING_CALL = 'CALL show waiting call'
export const SHOW_RECONNECTING_CALL = 'CALL show reconnecting call'
export const SHOW_REINITIALIZE_CALL = 'CALL show reinitialize call'
export const ENABLE_CURRENT_USER_CAMERA = 'CALL enable current user camera'
export const DISABLE_CURRENT_USER_CAMERA = 'CALL disable current user camera'
export const ENABLE_CURRENT_USER_MICROPHONE =
  'CALL enable current user microphone'
export const DISABLE_CURRENT_USER_MICROPHONE =
  'CALL disable current user microphone'
export const SET_VIDEO_AS_AVAILABLE = 'CALL Set Video As Available'
export const SET_VIDEO_AS_UNAVAILABLE = 'CALL Set Video As Unavailable'
export const SET_VIDEO_AS_STARTED = 'CALL Set Video As Started'
export const SET_VIDEO_AS_STOPPED = 'CALL Set Video As Stopped'
export const REINITIALIZE_ROOM = 'CALL Reinitialize room media tracks'
export const PARTICIPANT_CONNECTED = 'CALL Participant has joined'
export const PARTICIPANT_DISCONNECTED = 'CALL Participant has disconnected'
export const PARTICIPANT_ENABLED_CAMERA = 'CALL Participant enabled camera'
export const PARTICIPANT_DISABLED_CAMERA = 'CALL Participant disabled camera'
export const PLAY_RINGING_AUDIO = 'CALL Play ringing audio'
export const STOP_RINGING_AUDIO = 'CALL Stop ringing audio'
export const PLAY_CALL_ENDED_AUDIO = 'CALL Play call ended audio'
export const STOP_CALL_ENDED_AUDIO = 'CALL Stop call ended audio'
export const OPEN_CALL_SETTINGS = 'CALL Open call settings'
export const CLOSE_CALL_SETTINGS = 'CALL Close call settings'
export const CHECK_DEVICES = 'CALL Check device availability'
export const CHECK_DEVICES_COMPLETE = 'CALL Check device availability complete'
export const SET_MICROPHONE_AVAILABILITY = 'CALL set microphone availability'
export const SET_CAMERA_AVAILABILITY = 'CALL set camera availability'
export const FETCH_DEVICES = 'CALL fetch devices'
export const FETCH_AUDIO_DEVICES_COMPLETE = 'CALL fetch audio devices complete'
export const FETCH_AUDIO_OUTPUT_DEVICES_COMPLETE =
  'CALL fetch audio output devices complete'
export const FETCH_VIDEO_DEVICES_COMPLETE = 'CALL fetch video devices complete'
export const FETCH_DEVICES_FAILED = 'CALL fetch devices failed'
export const FETCH_DEVICES_SUCCESS = 'CALL fetch devices success'
export const FETCH_INITIATED_CALLS = 'CALL fetch initiated calls'
export const FETCH_INITIATED_CALLS_COMPLETE =
  'CALL fetch initiated calls complete'
export const UPDATE_INITIATED_CALL_STATUS_TO_ENDED =
  'CALL update initiated call status to ended'
export const FETCH_ACTIVE_CALLS = 'CALL fetch active calls'
export const FETCH_ACTIVE_CALLS_COMPLETE = 'CALL fetch active calls complete'
export const UPDATE_ACTIVE_CALL_STATUS_TO_ENDED =
  'CALL update active call status to ended'
export const APPLY_SELECTED_AUDIO_DEVICE = 'CALL apply selected audio device'
export const APPLY_SELECTED_AUDIO_OUTPUT_DEVICE =
  'CALL apply selected audio output device'
export const APPLY_SELECTED_VIDEO_DEVICE = 'CALL apply selected video device'
export const CLOSE_SETTINGS = 'CALL close settings'
export const ACCEPT_CALL = 'CALL accept call'
export const ABORT_CALL = 'CALL abort call'
export const DECLINE_CALL = 'CALL decline call'
export const CANCEL_CALL = 'CALL cancel call'
export const CHECK_USER_AVAILABILITY = 'CALL check availability'
export const FLAG_USER_AS_AVAILABLE = 'CALL flag user as vailable'
export const FLAG_USER_AS_UNAVAILABLE = 'CALL flag user as unavailable'
export const PARTICIPANT_DECLINED = 'CALL participant decline'
export const HANG_UP = 'CALL Hang Up'
export const CALL_EMPTY = 'CALL room empty'
export const CLOSE_CALLS_BEFORE_INITIATE = 'CALL attempt close all opened calls'
export const SET_CALL_END = 'CALL set numbers of opened and ended calls'
export const ATTEMPT_CLOSE_CALL = 'CALL attempt close a call'
export const OPEN_CALL_BROWSER_SUPPORT = 'CALL Open call browser support'
export const NO_ACTION = 'CALL No action'
export const TOGGLE_DRAG = 'CALL toggle drag'
export const RECOVER_CALL = 'CALL recover call'
export const SET_ATTEMPTING_RECONNECT = 'CALL set attempting to reconnect'
export const SET_RECONNECTION_BUMPER = 'CALL set reconnection bumper'
export const STORE_CALL_SETTINGS = 'CALL store call window settings'
export const SET_LOCAL_VIDEO_ENABLED = 'CALL set local video enabled'

export const Source = {
  INBOUND: 'INBOUND',
  OUTBOUND: 'OUTBOUND'
}

export interface CallDetail {
  callId: string
  isReconnect: boolean
  source: string
  room: RoomState
  billableService: BillableService
}

export interface CallConfiguration {
  isReconnect: boolean
  source: string
  room: RoomState
  videoTokenResponse: VideoTokenResponse
}

export interface DeviceAvailability {
  audio: boolean
  video: boolean
}

export interface InitiatedCallsDetail {
  calls: Call[]
  initiator: string
}

export interface ReconnectConfiguration {
  room: RoomState
  source: string
}

/**
 * Actions
 */
export class SetCallIsExpected implements Action {
  readonly type = SET_CALL_IS_EXPECTED

  constructor(public payload: boolean) {}
}
export class SetCallIsSupported implements Action {
  readonly type = SET_CALL_IS_SUPPORTED

  constructor(public payload: boolean) {}
}

export class SetConferencingEnabled implements Action {
  readonly type = SET_CONFERENCING_ENABLED

  constructor(public payload: boolean) {}
}

export class SetLocalVideoEnabled implements Action {
  readonly type = SET_LOCAL_VIDEO_ENABLED

  constructor(public payload: boolean) {}
}

export class InitiateCall implements Action {
  readonly type = INITIATE_CALL

  constructor(public payload: CallDetail) {}
}

export class ReceiveCall implements Action {
  readonly type = RECEIVE_CALL

  constructor(public payload: CallDetail) {}
}

export class FetchTwilioToken implements Action {
  readonly type = FETCH_TWILIO_TOKEN

  constructor(public payload: CreateCallTokenRequest) {}
}

export class FetchTwilioTokenComplete implements Action {
  readonly type = FETCH_TWILIO_TOKEN_COMPLETE

  constructor(public payload: VideoTokenResponse) {}
}

export class FetchTwilioTokenFailed implements Action {
  readonly type = FETCH_TWILIO_TOKEN_FAILED
}

export class FetchInitiatedCalls implements Action {
  readonly type = FETCH_INITIATED_CALLS

  constructor(public payload: FetchCallsRequest) {}
}

export class FetchInitiatedCallsComplete implements Action {
  readonly type = FETCH_INITIATED_CALLS_COMPLETE

  constructor(public payload: InitiatedCallsDetail) {}
}

export class UpdateInitiatedCallStatusToEnded implements Action {
  readonly type = UPDATE_INITIATED_CALL_STATUS_TO_ENDED

  constructor(public payload: UpdateCallRequest) {}
}

export class FetchActiveCalls implements Action {
  readonly type = FETCH_ACTIVE_CALLS
}

export class FetchActiveCallsComplete implements Action {
  readonly type = FETCH_ACTIVE_CALLS_COMPLETE

  constructor(public payload: InitiatedCallsDetail) {}
}

export class UpdateActiveCallStatusToEnded implements Action {
  readonly type = UPDATE_ACTIVE_CALL_STATUS_TO_ENDED

  constructor(public payload: UpdateCallRequest) {}
}

export class CreateLocalTracks implements Action {
  readonly type = CREATE_LOCAL_TRACKS

  constructor(public payload: TwilioConfiguration) {}
}

export class CreateLocalTracksComplete implements Action {
  readonly type = CREATE_LOCAL_TRACKS_COMPLETE

  constructor() {}
}

export class CreateLocalTracksFailed implements Action {
  readonly type = CREATE_LOCAL_TRACKS_FAILED
  constructor() {}
}

export class CreateRoom implements Action {
  readonly type = CREATE_ROOM
}

export class CreateRoomSuccessful implements Action {
  readonly type = CREATE_ROOM_SUCCESSFUL
}

export class CreateRoomFailed implements Action {
  readonly type = CREATE_ROOM_FAILED

  constructor(public payload: any) {}
}

export class FetchSubaccount implements Action {
  readonly type = FETCH_SUBACCOUNT
  constructor(public payload: string) {}
}

export class FetchSubaccountComplete implements Action {
  readonly type = FETCH_SUBACCOUNT_COMPLETE
  constructor(public payload: string) {}
}

export class FetchSubaccountFailed implements Action {
  readonly type = FETCH_SUBACCOUNT_FAILED
}

export class SaveCall implements Action {
  readonly type = SAVE_CALL
  constructor(public payload: CreateCallInteractionRequest) {}
}

export class SaveCallComplete implements Action {
  readonly type = SAVE_CALL_COMPLETE
  constructor(public payload: string) {}
}

export class FetchCallDetails implements Action {
  readonly type = FETCH_CALL_DETAILS
  constructor(public payload: FetchCallDetailsRequest) {}
}

export class FetchCallDetailsComplete implements Action {
  readonly type = FETCH_CALL_DETAILS_COMPLETE
  constructor(public payload: FetchCallDetailsResponse) {}
}

export class UpdateCallStatusToEnded implements Action {
  readonly type = UPDATE_CALL_STATUS_TO_ENDED
  constructor(public payload: UpdateCallRequest) {}
}

export class MinimizeWindow implements Action {
  readonly type = MINIMIZE_WINDOW
}

export class EnterFullscreen implements Action {
  readonly type = ENTER_FULLSCREEN
}

export class NormalizeWindow implements Action {
  readonly type = NORMALIZE_WINDOW
}

export class ShowIncomingCall implements Action {
  readonly type = SHOW_INCOMING_CALL

  constructor(public payload: RoomState) {}
}

export class ShowWaitingCall implements Action {
  readonly type = SHOW_WAITING_CALL

  constructor(public payload: RoomState) {}
}

export class ShowReconnectingCall implements Action {
  readonly type = SHOW_RECONNECTING_CALL

  constructor(public payload: ReconnectConfiguration) {}
}

export class EnableCurrentUserCamera implements Action {
  readonly type = ENABLE_CURRENT_USER_CAMERA
}

export class DisableCurrentUserCamera implements Action {
  readonly type = DISABLE_CURRENT_USER_CAMERA
}

export class EnableCurrentUserMicrophone implements Action {
  readonly type = ENABLE_CURRENT_USER_MICROPHONE
}

export class DisableCurrentUserMicrophone implements Action {
  readonly type = DISABLE_CURRENT_USER_MICROPHONE
}

export class SetVideoAsAvailable implements Action {
  readonly type = SET_VIDEO_AS_AVAILABLE
}

export class SetVideoAsUnavailable implements Action {
  readonly type = SET_VIDEO_AS_UNAVAILABLE
}

export class SetVideoAsStarted implements Action {
  readonly type = SET_VIDEO_AS_STARTED
  constructor(public payload: string) {}
}

export class SetVideoAsStopped implements Action {
  readonly type = SET_VIDEO_AS_STOPPED
  constructor(public payload: string) {}
}

export class HangUp implements Action {
  readonly type = HANG_UP
}

export class Reinitialize implements Action {
  readonly type = REINITIALIZE_ROOM
}

export class ParticipantConnected implements Action {
  readonly type = PARTICIPANT_CONNECTED

  constructor(public payload: string) {}
}

export class ParticipantDisconnected implements Action {
  readonly type = PARTICIPANT_DISCONNECTED
  constructor(public payload: string) {}
}

export class ParticipantEnabledCamera implements Action {
  readonly type = PARTICIPANT_ENABLED_CAMERA

  constructor(public payload: string) {}
}

export class ParticipantDisabledCamera implements Action {
  readonly type = PARTICIPANT_DISABLED_CAMERA

  constructor(public payload: string) {}
}

export class PlayRingingAudio implements Action {
  readonly type = PLAY_RINGING_AUDIO
}

export class StopRingingAudio implements Action {
  readonly type = STOP_RINGING_AUDIO
}

export class PlayCallEndedAudio implements Action {
  readonly type = PLAY_CALL_ENDED_AUDIO
}

export class StopCallEndedAudio implements Action {
  readonly type = STOP_CALL_ENDED_AUDIO
}

export class OpenCallSettings implements Action {
  readonly type = OPEN_CALL_SETTINGS
}

export class CloseCallSettings implements Action {
  readonly type = CLOSE_CALL_SETTINGS
}

export class CheckDevices implements Action {
  readonly type = CHECK_DEVICES
}

export class CheckDevicesComplete implements Action {
  readonly type = CHECK_DEVICES_COMPLETE

  constructor(public payload: DeviceAvailability) {}
}

export class SetMicrophoneAvailability implements Action {
  readonly type = SET_MICROPHONE_AVAILABILITY

  constructor(public payload: boolean) {}
}

export class SetCameraAvailability implements Action {
  readonly type = SET_CAMERA_AVAILABILITY

  constructor(public payload: boolean) {}
}

export class FetchDevices implements Action {
  readonly type = FETCH_DEVICES

  constructor(public payload: boolean) {}
}

export class FetchAudioDevicesComplete implements Action {
  readonly type = FETCH_AUDIO_DEVICES_COMPLETE

  constructor(public payload: MediaDeviceInfo[]) {}
}

export class FetchAudioOutputDevicesComplete implements Action {
  readonly type = FETCH_AUDIO_OUTPUT_DEVICES_COMPLETE

  constructor(public payload: MediaDeviceInfo[]) {}
}

export class FetchVideoDevicesComplete implements Action {
  readonly type = FETCH_VIDEO_DEVICES_COMPLETE

  constructor(public payload: MediaDeviceInfo[]) {}
}

export class FetchDevicesFailed implements Action {
  readonly type = FETCH_DEVICES_FAILED
}

export class FetchDevicesSuccess implements Action {
  readonly type = FETCH_DEVICES_SUCCESS
}

export class ApplySelectedAudioDevice implements Action {
  readonly type = APPLY_SELECTED_AUDIO_DEVICE

  constructor(public payload: { deviceId: string; closeSettings: boolean }) {}
}

export class ApplySelectedAudioOutputDevice implements Action {
  readonly type = APPLY_SELECTED_AUDIO_OUTPUT_DEVICE

  constructor(public payload: { deviceId: string; closeSettings: boolean }) {}
}

export class ApplySelectedVideoDevice implements Action {
  readonly type = APPLY_SELECTED_VIDEO_DEVICE

  constructor(public payload: { deviceId: string; closeSettings: boolean }) {}
}

export class CloseSettings implements Action {
  readonly type = CLOSE_SETTINGS
}

export class AbortCall implements Action {
  readonly type = ABORT_CALL

  constructor(public payload: string) {}
}

export class AcceptCall implements Action {
  readonly type = ACCEPT_CALL

  constructor(public payload: { enableVideo: boolean }) {}
}

export class DeclineCall implements Action {
  readonly type = DECLINE_CALL
  constructor(public payload: string) {}
}

export class CancelCall implements Action {
  readonly type = CANCEL_CALL
}

export class ParticipantDeclined implements Action {
  readonly type = PARTICIPANT_DECLINED
  constructor(public payload: string) {}
}

export class CallEmpty implements Action {
  readonly type = CALL_EMPTY
}

export class CheckUserAvailability implements Action {
  readonly type = CHECK_USER_AVAILABILITY
  constructor(public payload: FetchCallsRequest) {}
}

export class FlagUserAsAvailable implements Action {
  readonly type = FLAG_USER_AS_AVAILABLE
  constructor(public payload: string) {}
}

export class FlagUserAsUnavailable implements Action {
  readonly type = FLAG_USER_AS_UNAVAILABLE
  constructor(public payload: string) {}
}

export class CloseCallsBeforeInitiate implements Action {
  readonly type = CLOSE_CALLS_BEFORE_INITIATE
  constructor(public payload: CallDetail) {}
}

export class SetCallEnd implements Action {
  readonly type = SET_CALL_END
  constructor(public payload: CallEndState) {}
}

export class AttemptCloseCall implements Action {
  readonly type = ATTEMPT_CLOSE_CALL
  constructor(public payload: string) {}
}

export class OpenCallBrowserSupport implements Action {
  readonly type = OPEN_CALL_BROWSER_SUPPORT
}

export class NoAction implements Action {
  readonly type = NO_ACTION
}

export class ToggleDrag implements Action {
  readonly type = TOGGLE_DRAG

  constructor(public payload: any) {}
}

export class RecoverCall implements Action {
  readonly type = RECOVER_CALL

  constructor() {}
}

export class SetAttemptingReconnect implements Action {
  readonly type = SET_ATTEMPTING_RECONNECT

  constructor(public payload: boolean) {}
}

export class SetReconnectionBumper implements Action {
  readonly type = SET_RECONNECTION_BUMPER

  constructor(public payload: boolean) {}
}

export class StoreCallSettings implements Action {
  readonly type = STORE_CALL_SETTINGS

  constructor() {}
}

// Actions data type
export type Actions =
  | InitiateCall
  | ReceiveCall
  | SaveCall
  | SaveCallComplete
  | FetchCallDetails
  | FetchCallDetailsComplete
  | FetchTwilioToken
  | FetchTwilioTokenComplete
  | FetchTwilioTokenFailed
  | CreateLocalTracks
  | CreateLocalTracksComplete
  | CreateLocalTracksFailed
  | CreateRoom
  | CreateRoomFailed
  | CreateRoomSuccessful
  | FetchSubaccount
  | FetchSubaccountComplete
  | FetchInitiatedCalls
  | FetchInitiatedCallsComplete
  | UpdateInitiatedCallStatusToEnded
  | FetchActiveCalls
  | FetchActiveCallsComplete
  | UpdateActiveCallStatusToEnded
  | SaveCall
  | SaveCallComplete
  | UpdateCallStatusToEnded
  | EnterFullscreen
  | NormalizeWindow
  | ShowIncomingCall
  | ShowWaitingCall
  | ShowReconnectingCall
  | EnableCurrentUserCamera
  | DisableCurrentUserCamera
  | EnableCurrentUserMicrophone
  | DisableCurrentUserMicrophone
  | SetVideoAsAvailable
  | SetVideoAsUnavailable
  | SetVideoAsStarted
  | SetVideoAsStopped
  | HangUp
  | CallEmpty
  | Reinitialize
  | ParticipantConnected
  | ParticipantDisconnected
  | ParticipantEnabledCamera
  | ParticipantDisabledCamera
  | PlayRingingAudio
  | StopRingingAudio
  | PlayCallEndedAudio
  | StopCallEndedAudio
  | OpenCallSettings
  | CloseCallSettings
  | CheckDevices
  | CheckDevicesComplete
  | SetMicrophoneAvailability
  | SetCameraAvailability
  | FetchDevices
  | FetchAudioDevicesComplete
  | FetchAudioOutputDevicesComplete
  | FetchVideoDevicesComplete
  | FetchDevicesFailed
  | ApplySelectedAudioDevice
  | ApplySelectedAudioOutputDevice
  | ApplySelectedVideoDevice
  | CloseSettings
  | AbortCall
  | DeclineCall
  | CancelCall
  | ParticipantDeclined
  | FlagUserAsAvailable
  | FlagUserAsUnavailable
  | CloseCallsBeforeInitiate
  | SetCallEnd
  | AttemptCloseCall
  | OpenCallBrowserSupport
  | NoAction
  | ToggleDrag
  | RecoverCall
  | SetAttemptingReconnect
  | SetReconnectionBumper
  | StoreCallSettings
