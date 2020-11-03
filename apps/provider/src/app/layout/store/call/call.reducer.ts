import { Action } from '@ngrx/store';

import { FetchCallDetailsResponse } from 'selvera-api/dist/lib/selvera-api/providers/conference/responses/fetchCallDetailsResponse.interface';
import * as Actions from './call.action';
import { Source } from './call.action';
import {
  CallState,
  ControlsState,
  initialState,
  Person,
  RoomState,
  WindowState
} from './call.state';

export function callReducer(state = initialState, action: Action): CallState {
  switch (action.type) {
    case Actions.SET_CALL_IS_SUPPORTED:
      return {
        ...state,
        isSupported: (action as Actions.SetCallIsSupported).payload
      };
    case Actions.SET_CONFERENCING_ENABLED:
      return {
        ...state,
        conferencingEnabled: (action as Actions.SetConferencingEnabled).payload
      };
    case Actions.FETCH_INITIATED_CALLS:
      return {
        ...state,
        callUserId: (action as Actions.FetchInitiatedCalls).payload.account
      };
    case Actions.ENTER_FULLSCREEN:
      return {
        ...state,
        windowState: WindowState.FULLSCREEN
      };
    case Actions.NORMALIZE_WINDOW:
      return {
        ...state,
        windowState: WindowState.DEFAULT
      };
    case Actions.MINIMIZE_WINDOW:
      return {
        ...state,
        windowState: WindowState.MINIMIZED
      };
    case Actions.INITIATE_CALL:
      return {
        ...state,
        billableService: (action as Actions.InitiateCall).payload.billableService,
        isCallStarted: true,
        isMicrophoneEnabled: true,
        isRemoteVideoEnabled: false,
        hasVideoStarted: false,
        source: (action as Actions.InitiateCall).payload.source,
        isReconnect: (action as Actions.InitiateCall).payload.isReconnect,
        callId: (action as Actions.InitiateCall).payload.callId,
        room: (action as Actions.InitiateCall).payload.room,
        callEndState: {
          opened: 0,
          ended: 0
        }
      };
    case Actions.RECEIVE_CALL:
      return {
        ...state,
        isCallStarted: true,
        isRemoteVideoEnabled: false,
        hasVideoStarted: false,
        source: (action as Actions.ReceiveCall).payload.source || Source.INBOUND,
        isReconnect: (action as Actions.ReceiveCall).payload.isReconnect,
        callId: (action as Actions.ReceiveCall).payload.callId,
        room: {
          ...(action as Actions.ReceiveCall).payload.room
        }
      };
    case Actions.FETCH_SUBACCOUNT:
      return {
        ...state,
        subaccountId: ''
      };
    case Actions.FETCH_SUBACCOUNT_COMPLETE:
      return {
        ...state,
        subaccountId: (action as Actions.FetchSubaccountComplete).payload
      };
    case Actions.FETCH_SUBACCOUNT_FAILED:
      return {
        ...state,
        isCallStarted: false
      };
    case Actions.FETCH_TWILIO_TOKEN_COMPLETE:
      return {
        ...state,
        twilioToken: (action as Actions.FetchTwilioTokenComplete).payload.jwt
      };
    case Actions.FETCH_TWILIO_TOKEN_FAILED:
      return {
        ...state,
        isCallStarted: false
      };
    case Actions.SHOW_WAITING_CALL:
      return {
        ...state,
        source: Source.OUTBOUND,
        hasEnteredRoom: false,
        participantJoined: false,
        controlsState: ControlsState.WAITING,
        windowState: WindowState.DEFAULT,
        room: (action as Actions.ShowWaitingCall).payload
      };
    case Actions.SHOW_INCOMING_CALL:
      return {
        ...state,
        source: Source.INBOUND,
        hasEnteredRoom: false,
        participantJoined: false,
        controlsState: ControlsState.NOTIFYING,
        windowState: WindowState.DEFAULT,
        room: (action as Actions.ShowIncomingCall).payload
      };
    case Actions.SHOW_RECONNECTING_CALL:
      return {
        ...state,
        source: (action as Actions.ShowReconnectingCall).payload.source,
        hasEnteredRoom: false,
        participantJoined: false,
        controlsState: ControlsState.RECONNECTING,
        windowState: WindowState.DEFAULT,
        room: (action as Actions.ShowReconnectingCall).payload.room
      };
    case Actions.CREATE_LOCAL_TRACKS:
      return {
        ...state,
        isCameraEnabled: (action as Actions.CreateLocalTracks).payload.enableVideo
      };
    case Actions.CREATE_ROOM:
      return {
        ...state,
        controlsState: ControlsState.WAITING
      };
    case Actions.CREATE_ROOM_SUCCESSFUL:
      return {
        ...state,
        hasEnteredRoom: true,
        controlsState: ControlsState.CALL_ON_GOING
      };
    case Actions.SAVE_CALL_COMPLETE:
      return {
        ...state,
        callId: (action as Actions.SaveCallComplete).payload
      };
    case Actions.FETCH_CALL_DETAILS_COMPLETE:
      return {
        ...state,
        room: updateParticipantIds(
          (action as Actions.FetchCallDetailsComplete).payload,
          state.room
        )
      };
    case Actions.ENABLE_CURRENT_USER_CAMERA:
      return {
        ...state,
        isCameraEnabled: true
      };
    case Actions.DISABLE_CURRENT_USER_CAMERA:
      return {
        ...state,
        isCameraEnabled: false
      };
    case Actions.ENABLE_CURRENT_USER_MICROPHONE:
      return {
        ...state,
        isMicrophoneEnabled: true
      };
    case Actions.DISABLE_CURRENT_USER_MICROPHONE:
      return {
        ...state,
        isMicrophoneEnabled: false
      };
    case Actions.SET_VIDEO_AS_AVAILABLE:
      return {
        ...state,
        isRemoteVideoEnabled: true,
        isVideoStreamAvailable: true
      };
    case Actions.SET_VIDEO_AS_UNAVAILABLE:
      return {
        ...state,
        isVideoStreamAvailable: false
      };
    case Actions.SET_VIDEO_AS_STARTED:
      return {
        ...state,
        hasVideoStarted: true
      };
    case Actions.SET_VIDEO_AS_STOPPED:
      return {
        ...state,
        hasVideoStarted: false
      };
    case Actions.PARTICIPANT_ENABLED_CAMERA:
      return {
        ...state,
        isRemoteVideoEnabled: true
      };
    case Actions.PARTICIPANT_DISABLED_CAMERA:
      return {
        ...state,
        isRemoteVideoEnabled: false
      };
    case Actions.PARTICIPANT_CONNECTED:
      return setParticipantParticipating(
        state,
        (action as Actions.ParticipantConnected).payload,
        true
      );
    case Actions.PARTICIPANT_DISCONNECTED:
      return setParticipantParticipating(
        state,
        (action as Actions.ParticipantConnected).payload,
        false
      );
    case Actions.CANCEL_CALL:
      return {
        ...state,
        isCallStarted: false,
        callId: null
      };
    case Actions.DECLINE_CALL:
      return {
        ...state,
        isCallStarted: false,
        callId: null
      };
    case Actions.CALL_EMPTY:
      return {
        ...state,
        isCallStarted: false,
        callId: null
      };
    case Actions.HANG_UP:
      return {
        ...state,
        isCallStarted: false,
        callId: null
      };
    case Actions.PARTICIPANT_DECLINED:
      return setParticipantAvailability(
        state,
        (action as Actions.ParticipantDeclined).payload,
        false
      );
    case Actions.FLAG_USER_AS_AVAILABLE:
      return setParticipantAvailability(
        state,
        (action as Actions.FlagUserAsAvailable).payload,
        true
      );
    case Actions.FLAG_USER_AS_UNAVAILABLE:
      return setParticipantAvailability(
        state,
        (action as Actions.FlagUserAsUnavailable).payload,
        false
      );
    case Actions.CHECK_DEVICES:
      return {
        ...state,
        isCheckingDeviceAccess: true
      };
    case Actions.CHECK_DEVICES_COMPLETE:
      const payload = (action as Actions.CheckDevicesComplete).payload;
      return {
        ...state,
        isCheckingDeviceAccess: false,
        hasVideoDeviceAccess: (action as Actions.CheckDevicesComplete).payload.video,
        hasAudioDeviceAccess: (action as Actions.CheckDevicesComplete).payload.audio,
        fetchDevicesSuccess: payload.video && payload.audio
      };
    case Actions.APPLY_SELECTED_AUDIO_DEVICE:
      const audioInputDevice = (action as Actions.ApplySelectedAudioDevice).payload;
      return { ...state, selectedAudioInputDevice: audioInputDevice };
    case Actions.APPLY_SELECTED_AUDIO_OUTPUT_DEVICE:
      const audioOutputDevice = (action as Actions.ApplySelectedAudioOutputDevice)
        .payload;
      return { ...state, selectedAudioOutputDevice: audioOutputDevice };
    case Actions.APPLY_SELECTED_VIDEO_DEVICE:
      const videoInputDevice = (action as Actions.ApplySelectedVideoDevice).payload;
      return { ...state, selectedVideoInputDevice: videoInputDevice };
    case Actions.FETCH_AUDIO_DEVICES_COMPLETE:
      const audioDevices = (action as Actions.FetchAudioDevicesComplete).payload;
      return {
        ...state,
        selectedAudioInputDevice: audioDevices[0].deviceId,
        audioInputDevices: audioDevices
      };
    case Actions.FETCH_AUDIO_OUTPUT_DEVICES_COMPLETE:
      const audioOutputDevices = (action as Actions.FetchAudioOutputDevicesComplete)
        .payload;
      return {
        ...state,
        selectedAudioOutputDevice: audioOutputDevices[0].deviceId,
        audioOutputDevices: audioOutputDevices
      };
    case Actions.FETCH_VIDEO_DEVICES_COMPLETE:
      const videoDevices = (action as Actions.FetchVideoDevicesComplete).payload;
      return {
        ...state,
        selectedVideoInputDevice: videoDevices[0].deviceId,
        videoInputDevices: videoDevices
      };
    case Actions.CLOSE_CALLS_BEFORE_INITIATE:
      return {
        ...state,
        source: (action as Actions.InitiateCall).payload.source,
        isReconnect: (action as Actions.InitiateCall).payload.isReconnect,
        callId: (action as Actions.InitiateCall).payload.callId,
        room: (action as Actions.InitiateCall).payload.room,
        billableService: (action as Actions.InitiateCall).payload.billableService
      };
    case Actions.SET_CALL_END:
      return {
        ...state,
        callEndState: (action as Actions.SetCallEnd).payload
      };
    case Actions.ATTEMPT_CLOSE_CALL:
      return {
        ...state,
        callEndState: {
          opened: state.callEndState.opened,
          ended: state.callEndState.ended + 1
        }
      };
    case Actions.FETCH_DEVICES_FAILED:
      return {
        ...state,
        fetchDevicesSuccess: false
      };
    case Actions.FETCH_DEVICES_SUCCESS:
      return {
        ...state,
        fetchDevicesSuccess: true
      };
    case Actions.TOGGLE_DRAG:
      return {
        ...state,
        isBeingDragged: !state.isBeingDragged,
        lastPosition: (action as Actions.ToggleDrag).payload || undefined
      };
    case Actions.SET_ATTEMPTING_RECONNECT:
      return {
        ...state,
        isAttemptingToReconnect: (action as Actions.SetAttemptingReconnect).payload
      };
    case Actions.SET_RECONNECTION_BUMPER:
      return {
        ...state,
        reconnectionBumper: (action as Actions.SetReconnectionBumper).payload
      };
    default: {
      return state;
    }
  }
}

function setParticipantAvailability(
  state: CallState,
  id: string,
  availability: boolean
): CallState {
  const participants: Person[] = state.room.participants;
  return {
    ...state,
    participantJoined: true,
    room: {
      ...state.room,
      participants: [
        ...participants.filter((tPerson) => tPerson.id !== id),
        ...participants
          .filter((tPerson) => tPerson.id === id)
          .map((tPerson) => {
            return {
              ...tPerson,
              isAvailable: availability,
              hasFetchedStatus: true
            };
          })
      ]
    }
  };
}

function setParticipantParticipating(
  state: CallState,
  id: string,
  participating: boolean
): CallState {
  const participants: Person[] = state.room.participants;
  return {
    ...state,
    participantJoined: true,
    room: {
      ...state.room,
      participants: [
        ...participants.filter((tPerson) => tPerson.id !== id),
        ...participants
          .filter((tPerson) => tPerson.id === id)
          .map((tPerson) => {
            return {
              ...tPerson,
              isParticipating: participating,
              hasFetchedStatus: true
            };
          })
      ]
    }
  };
}

function updateParticipantIds(
  response: FetchCallDetailsResponse,
  state: RoomState
): RoomState {
  return {
    ...state,
    participants: state.participants.map((participant) => {
      if (
        response.participants.attended.filter((x) => x.id === participant.id).length > 0
      ) {
        return {
          ...participant,
          callIdentity: response.participants.attended.filter(
            (x) => x.id === participant.id
          )[0].callIdentity
        };
      } else {
        return participant;
      }
    })
  };
}
