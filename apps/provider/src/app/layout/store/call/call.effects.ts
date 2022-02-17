import { Injectable } from '@angular/core'
import {
  COOKIE_CALL_BROWSERS_MODAL,
  COOKIE_CALL_DEVICES_MODAL,
  STORAGE_VIDEOCONFERENCE_SETTINGS
} from '@app/config'
import { CallLayoutService } from '@app/layout/call/services/call-layout.service'
import {
  BROWSER_TYPES,
  TwilioService
} from '@app/layout/call/services/twilio.service'
import { callSelector } from '@app/layout/store/call/call.selector'
import { CallState } from '@app/layout/store/call/call.state'
import { UIState } from '@app/layout/store/state'
import { ContextService } from '@app/service/context.service'
import { LoggingService } from '@app/service/logging.service'
import { NotifierService } from '@app/service/notifier.service'
import { FetchCallsResponse, GetCallAvailabilityResponse } from '@coachcare/sdk'
import { _ } from '@app/shared/utils/i18n.utils'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Action, select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { get } from 'lodash'
import { CookieService } from 'ngx-cookie-service'
import { from, Observable, of } from 'rxjs'
import {
  catchError,
  concatMap,
  debounceTime,
  flatMap,
  map,
  skip,
  switchMap,
  tap
} from 'rxjs/operators'
import { Conference, Interaction } from '@coachcare/sdk'
import * as callAction from './call.action'
import { CancelCall, DeviceAvailability, Source } from './call.action'
import { EnterFullscreen } from '.'

@Injectable()
export class CallEffects {
  callState: CallState

  constructor(
    private actions$: Actions,
    private cookie: CookieService,
    private context: ContextService,
    private interaction: Interaction,
    private logging: LoggingService,
    private store: Store<UIState>,
    private twilioService: TwilioService,
    private callLayoutService: CallLayoutService,
    private notifierService: NotifierService,
    private translator: TranslateService,
    private conference: Conference
  ) {
    this.store
      .pipe(select(callSelector))
      .subscribe((callState) => (this.callState = callState))

    this.context.organization$.subscribe((organization) => {
      const deviceInfo = this.twilioService.getDeviceInfo()
      const deviceSupported: boolean =
        deviceInfo.browser &&
        (deviceInfo.browser.toLowerCase() === BROWSER_TYPES.CHROME ||
          deviceInfo.browser.toLowerCase() === BROWSER_TYPES.FIREFOX ||
          deviceInfo.browser.toLowerCase() === BROWSER_TYPES.SAFARI ||
          deviceInfo.browser.toLowerCase() === BROWSER_TYPES.EDGE_CHROMIUM)
          ? true
          : false

      const conferencingEnabled = get(
        organization,
        'preferences.comms.videoConferencing.isEnabled',
        false
      )

      this.store.dispatch(new callAction.SetCallIsSupported(deviceSupported))
      this.store.dispatch(
        new callAction.SetConferencingEnabled(conferencingEnabled)
      )

      if (organization) {
        this.store.dispatch(new callAction.FetchSubaccount(organization.id))
      }
    })
  }

  initiateCall$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.INITIATE_CALL),
      debounceTime(300),
      map((action) => (action as callAction.InitiateCall).payload),
      flatMap((payload) => {
        const actionGroup = []
        void this.logging.log({
          logLevel: 'info',
          data: {
            type: 'videoconferencing',
            functionType: 'call-initiate',
            message: 'initiated call',
            room: payload.room
          }
        })

        payload.room.participants.forEach((participant) => {
          if (
            this.callState.callUserId === participant.id &&
            this.callState.room.initiatorId === participant.id
          ) {
            actionGroup.push(new callAction.FlagUserAsAvailable(participant.id))
          } else {
            actionGroup.push(
              new callAction.CheckUserAvailability({
                account: participant.id,
                organization: this.callState.room.organizationId,
                status: 'in-progress'
              })
            )
          }
        })
        return actionGroup
      })
    )
  )

  room$: Observable<Action> = createEffect(() =>
    this.conference.room$.pipe(
      skip(1),
      debounceTime(300),
      switchMap((room) => {
        if (
          this.callState.isCallStarted ||
          room.initiator.id === this.context.user.id
        ) {
          return of(new callAction.NoAction())
        } else {
          return of(
            new callAction.ReceiveCall({
              participantIsAway: false,
              billableService: {
                id: '',
                displayName: '',
                name: ''
              },
              callId: room.callId,
              isReconnect: false,
              source: Source.INBOUND,
              room: {
                name: room.room,
                organizationId: room.organization.id,
                initiatorId: room.initiator.id,
                participants: [
                  {
                    id: room.initiator.id,
                    name: `${
                      room.initiator.firstName
                    } ${room.initiator.lastName[0].toUpperCase()}.`,
                    isParticipating: false,
                    isAvailable: false,
                    hasFetchedStatus: false,
                    callIdentity: ''
                  },
                  {
                    id: this.context.user.id,
                    name: `${
                      this.context.user.firstName
                    } ${this.context.user.lastName[0].toUpperCase()}.`,
                    isParticipating: false,
                    isAvailable: false,
                    hasFetchedStatus: false,
                    callIdentity: ''
                  }
                ]
              }
            })
          )
        }
      })
    )
  )

  receiveCall$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.RECEIVE_CALL),
      debounceTime(300),
      map((action) => (action as callAction.ReceiveCall).payload),
      flatMap((payload) => {
        const actions = []
        void this.logging.log({
          logLevel: 'info',
          data: {
            type: 'videoconferencing',
            functionType: 'call-received',
            message: 'received call',
            callId: payload.callId
          }
        })

        if (!this.callState.isReconnect) {
          actions.push(new callAction.ShowIncomingCall(this.callState.room))
        }

        actions.push(
          new callAction.FetchCallDetails({ callId: payload.callId })
        )
        return actions
      })
    )
  )

  fetchToken$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.FETCH_TWILIO_TOKEN),
      debounceTime(300),
      map((action) => (action as callAction.FetchTwilioToken).payload),
      switchMap((payload) => {
        return this.twilioService.initialize(payload).pipe(
          flatMap((authentication) => {
            const actions = []
            actions.push(
              new callAction.FetchTwilioTokenComplete(authentication)
            )
            return actions
          }),
          catchError(() => of(new callAction.FetchTwilioTokenFailed()))
        )
      })
    )
  )

  fetchTwilioTokenComplete$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.FETCH_TWILIO_TOKEN_COMPLETE),
      debounceTime(300),
      flatMap(() => {
        const actions = []
        if (!this.callState.isReconnect) {
          if (this.callState.source === Source.INBOUND) {
            actions.push(
              new callAction.CreateLocalTracks({
                enableAudio: this.callState.hasAudioDeviceAccess,
                enableVideo: this.callState.isLocalVideoEnabled ?? false,
                roomName: this.callState.room.name,
                authenticationToken: this.callState.twilioToken,
                videoBackgroundEnabled: this.callState.videoBackgroundEnabled,
                videoBackgroundUrl: this.callState.videoBackgroundUrl
              })
            )
          } else if (this.callState.source === Source.OUTBOUND) {
            actions.push(new callAction.ShowWaitingCall(this.callState.room))
          }
        } else {
          actions.push(
            new callAction.ShowReconnectingCall({
              source: this.callState.source,
              room: this.callState.room
            })
          )
        }
        return actions
      })
    )
  )

  createLocalTracks$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.CREATE_LOCAL_TRACKS),
      debounceTime(300),
      map((action) => (action as any).payload),
      switchMap((query) => {
        return this.twilioService.generateLocalTracks(query).pipe(
          map(() => new callAction.CreateLocalTracksComplete()),
          catchError(() => of(new callAction.CreateLocalTracksFailed()))
        )
      })
    )
  )

  playRingingAudio$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.PLAY_RINGING_AUDIO),
        debounceTime(300),
        tap(() => this.twilioService.playRinging())
      ),
    { dispatch: false }
  )

  stopRingingAudio$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.STOP_RINGING_AUDIO),
        debounceTime(300),
        tap(() => this.twilioService.stopRinging())
      ),
    { dispatch: false }
  )

  playCallEndedAudio$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.PLAY_CALL_ENDED_AUDIO),
        debounceTime(300),
        tap(() => this.twilioService.playCallEnding())
      ),
    { dispatch: false }
  )

  stopCallEndedAudio$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.STOP_CALL_ENDED_AUDIO),
        debounceTime(300),
        tap(() => this.twilioService.stopCallEnding())
      ),
    { dispatch: false }
  )

  createRoom$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.CREATE_ROOM),
      debounceTime(300),
      map((action) => (action as any).payload),
      switchMap((query) => {
        return this.twilioService.createRoom().pipe(
          flatMap((result: any) => {
            return [
              new callAction.CreateRoomSuccessful(),
              new callAction.FetchCallDetails({ callId: this.callState.callId })
            ]
          }),
          catchError((error) => of(new callAction.CreateRoomFailed(error)))
        )
      })
    )
  )

  fetchSubaccount$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.FETCH_SUBACCOUNT),
      map((action) => (action as any).payload),
      switchMap((organizationId) => {
        return from(this.conference.fetchSubaccount(organizationId)).pipe(
          flatMap((subaccounts: any) => {
            const actionGroup = []
            if (subaccounts.data.length > 0) {
              if (subaccounts.data[0].hasKeys) {
                actionGroup.push(
                  new callAction.FetchSubaccountComplete(subaccounts.data[0].id)
                )
                actionGroup.push(new callAction.FetchDevices(true))
              } else {
                actionGroup.push(new callAction.FetchSubaccountFailed())
              }
            } else {
              actionGroup.push(new callAction.FetchSubaccountFailed())
            }
            return actionGroup
          })
        )
      })
    )
  )

  saveCall$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.SAVE_CALL),
      debounceTime(300),
      map((action) => (action as any).payload),
      switchMap((createCallRequest) => {
        return from(
          this.interaction.createCall({
            ...createCallRequest,
            billableService:
              this.callState.billableService.id === '-1'
                ? null
                : this.callState.billableService.id
          })
        ).pipe(
          map((call: any) => {
            return new callAction.SaveCallComplete(call.id)
          })
        )
      })
    )
  )

  saveCallComplete$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.SAVE_CALL_COMPLETE),
      debounceTime(300),
      map((action) => (action as any).payload),
      flatMap((payload) => {
        return [
          new callAction.FetchTwilioToken({
            id: payload,
            account: this.context.accountId
          })
        ]
      })
    )
  )

  fetchCallDetails$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.FETCH_CALL_DETAILS),
      debounceTime(300),
      map((action) => (action as any).payload),
      switchMap((payload) => {
        return from(this.conference.fetchCallDetail(payload)).pipe(
          map((response: any) => {
            return new callAction.FetchCallDetailsComplete(response)
          })
        )
      })
    )
  )

  updateCallStatusToEnded$: Observable<Action> = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.UPDATE_CALL_STATUS_TO_ENDED),
        debounceTime(300),
        map((action) => (action as any).payload),
        tap((updateCallRequest) => {
          void this.logging.log({
            logLevel: 'info',
            data: {
              type: 'videoconferencing',
              functionType: 'call-ended',
              message: 'call has ended',
              params: updateCallRequest
            }
          })

          if (this.callState.twilioToken) {
            this.callLayoutService.showCallRatingModal()
          }

          return this.interaction
            .attemptCallEnd({ id: updateCallRequest.callId })
            .catch((error) => {})
        })
      ),
    { dispatch: false }
  )

  enterFullscreen$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.ENTER_FULLSCREEN),
        debounceTime(300),
        tap(() => this.callLayoutService.enterFullscreen())
      ),
    { dispatch: false }
  )

  minimizeWindow$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.MINIMIZE_WINDOW),
        debounceTime(300),
        tap(() => this.callLayoutService.minimizeWindow())
      ),
    { dispatch: false }
  )

  normalizeWindow$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.NORMALIZE_WINDOW),
        debounceTime(300),
        tap(() => this.callLayoutService.normalizeWindow())
      ),
    { dispatch: false }
  )

  showIncomingCall$ = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.SHOW_INCOMING_CALL),
      debounceTime(300),
      switchMap(() => {
        if (this.callState.isExpected) {
          this.callLayoutService.showCall()
          return [
            new callAction.AcceptCall({
              enableVideo: this.callState.isLocalVideoEnabled
            }),
            new EnterFullscreen(),
            new callAction.SetCallIsExpected(false)
          ]
        }

        this.twilioService.playRinging()
        this.callLayoutService.showCall()

        return []
      })
    )
  )

  showWaitingCall$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.SHOW_WAITING_CALL),
        debounceTime(300),
        tap(() => this.callLayoutService.showCall())
      ),
    { dispatch: false }
  )

  showReconnectingCall$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.SHOW_RECONNECTING_CALL),
        debounceTime(300),
        tap(() => this.callLayoutService.showCall())
      ),
    { dispatch: false }
  )

  participantJoined$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.PARTICIPANT_CONNECTED),
        debounceTime(300),
        tap(() => this.twilioService.stopRinging())
      ),
    { dispatch: false }
  )

  enableCurrentUserCamera$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.ENABLE_CURRENT_USER_CAMERA),
        debounceTime(300),
        tap(() =>
          this.twilioService.enableCamera({
            backgroundEnabled: this.callState.videoBackgroundEnabled,
            backgroundUrl: this.callState.videoBackgroundUrl
          })
        )
      ),
    { dispatch: false }
  )

  disableCurrentUserCamera$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.DISABLE_CURRENT_USER_CAMERA),
        debounceTime(300),
        tap(() => this.twilioService.disableCamera())
      ),
    { dispatch: false }
  )

  enableCurrentUserMicrophone$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.ENABLE_CURRENT_USER_MICROPHONE),
        debounceTime(300),
        tap(() => this.twilioService.enableMicrophone())
      ),
    { dispatch: false }
  )

  disableCurrentUserMicrophone$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.DISABLE_CURRENT_USER_MICROPHONE),
        debounceTime(300),
        tap(() => this.twilioService.disableMicrophone())
      ),
    { dispatch: false }
  )

  hangUp$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.HANG_UP),
        debounceTime(300),
        tap(() => {
          this.twilioService.stopRinging()
          this.twilioService.disconnect()
          this.callLayoutService.closeCall()

          if (!this.callState.twilioToken) {
            return
          }

          this.callLayoutService.showCallRatingModal()
        })
      ),
    { dispatch: false }
  )

  reinitializeRoom$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.REINITIALIZE_ROOM),
        debounceTime(300),
        tap(() =>
          this.twilioService.reinitialize({
            videoBackgroundEnabled: this.callState.videoBackgroundEnabled
          })
        )
      ),
    { dispatch: false }
  )

  openCallSettings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.OPEN_CALL_SETTINGS),
        debounceTime(300),
        tap(() => {
          this.callLayoutService.showSettings()
        })
      ),
    { dispatch: false }
  )

  closeCallSettings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.CLOSE_CALL_SETTINGS),
        debounceTime(300),
        tap(() => this.callLayoutService.closeSettings())
      ),
    { dispatch: false }
  )

  checkDevices$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.CHECK_DEVICES),
        debounceTime(300),
        tap(() => {
          const deviceAvailability: DeviceAvailability = {
            audio: false,
            video: false
          }

          const onGetUserMedia = (params, successCallback, failedCallback) => {
            navigator.mediaDevices
              .getUserMedia(params)
              .then(successCallback)
              .catch(failedCallback)
          }

          const onCheckCamera = () => {
            onGetUserMedia(
              {
                video: true,
                audio: false
              },
              (localMediaStream) => {
                localMediaStream.getTracks().forEach((track) => {
                  track.stop()
                })
                deviceAvailability.video = true
                onCheckMicrophone()
              },
              () => {
                onCheckMicrophone()
              }
            )
          }

          const onCheckMicrophone = () => {
            onGetUserMedia(
              {
                video: false,
                audio: true
              },
              (localMediaStream) => {
                localMediaStream.getTracks().forEach((track) => {
                  track.stop()
                })
                deviceAvailability.audio = true
                this.store.dispatch(
                  new callAction.CheckDevicesComplete(deviceAvailability)
                )
              },
              () => {
                this.store.dispatch(
                  new callAction.CheckDevicesComplete(deviceAvailability)
                )
              }
            )
          }

          onCheckCamera()
        })
      ),
    { dispatch: false }
  )

  checkDevicesComplete$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.CHECK_DEVICES_COMPLETE),
        debounceTime(300),
        map((action) => (action as callAction.CheckDevicesComplete).payload),
        tap((deviceAvailability) => {
          if (deviceAvailability.audio || deviceAvailability.video) {
            this.store.dispatch(new callAction.FetchDevices(false))
          }
        })
      ),
    { dispatch: false }
  )

  fetchDevices$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.FETCH_DEVICES),
      debounceTime(300),
      map((action) => (action as any).payload),
      switchMap((payload) => {
        return this.twilioService.getDeviceSelectionOptions().pipe(
          flatMap((mediaDeviceInfoList) => {
            const browser = this.twilioService
              .getDeviceInfo()
              .browser.toLowerCase()
            let fetchDeviceSuccess = false
            if (browser === BROWSER_TYPES.FIREFOX) {
              mediaDeviceInfoList = mediaDeviceInfoList.map((mediaDevice) => ({
                deviceId: mediaDevice.deviceId,
                groupId: mediaDevice.groupId,
                kind: mediaDevice.kind,
                label:
                  mediaDevice.label ||
                  (mediaDevice.kind === 'audioinput'
                    ? _('VIDEO.AUDIO_INPUT')
                    : mediaDevice.kind === 'videoinput'
                    ? _('VIDEO.VIDEO_INPUT')
                    : mediaDevice.kind === 'audiooutput'
                    ? _('VIDEO.AUDIO_OUTPUT')
                    : undefined)
              })) as any

              fetchDeviceSuccess = !!mediaDeviceInfoList.find(
                (mediaDevice) =>
                  (mediaDevice.kind === 'audioinput' &&
                    mediaDevice.label !== _('VIDEO.AUDIO_INPUT')) ||
                  (mediaDevice.kind === 'videoinput' &&
                    mediaDevice.label !== _('VIDEO.VIDEO_INPUT')) ||
                  (mediaDevice.kind === 'audiooutput' &&
                    mediaDevice.label !== _('VIDEO.AUDIO_OUTPUT'))
              )
            }

            const audioDevices = mediaDeviceInfoList.filter(
              (deviceInfo) =>
                deviceInfo.kind === 'audioinput' && deviceInfo.label
            )
            const videoDevices = mediaDeviceInfoList.filter(
              (deviceInfo) =>
                deviceInfo.kind === 'videoinput' && deviceInfo.label
            )
            const audioOutputDevices = mediaDeviceInfoList.filter(
              (deviceInfo) =>
                deviceInfo.kind === 'audiooutput' && deviceInfo.label
            )
            const actionGroup = []

            if (audioDevices.length > 0) {
              actionGroup.push(
                new callAction.FetchAudioDevicesComplete(audioDevices)
              )
            }

            if (audioOutputDevices.length > 0) {
              actionGroup.push(
                new callAction.FetchAudioOutputDevicesComplete(
                  audioOutputDevices
                )
              )
            }

            if (videoDevices.length > 0) {
              actionGroup.push(
                new callAction.FetchVideoDevicesComplete(videoDevices)
              )
            }

            fetchDeviceSuccess =
              browser !== BROWSER_TYPES.FIREFOX
                ? audioDevices.length > 0
                : fetchDeviceSuccess

            if (!fetchDeviceSuccess) {
              if (payload) {
                actionGroup.push(new callAction.FetchDevicesFailed())
              }
            } else {
              actionGroup.push(new callAction.FetchDevicesSuccess())
            }
            return actionGroup
          })
        )
      })
    )
  )

  fetchDevicesFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.FETCH_DEVICES_FAILED),
        debounceTime(300),
        map((action) => (action as any).payload),
        tap(() => {
          if (this.callState.subaccountId !== '') {
            if (
              this.callState.conferencingEnabled &&
              this.callState.isSupported &&
              !(this.cookie.get(COOKIE_CALL_DEVICES_MODAL) === 'true')
            ) {
              this.callLayoutService.openAccessRequiredDialog()
            } else if (
              this.callState.conferencingEnabled &&
              !this.callState.isSupported &&
              !(this.cookie.get(COOKIE_CALL_BROWSERS_MODAL) === 'true')
            ) {
              this.callLayoutService.openBrowserUnsupported()
            } else if (
              this.callState.conferencingEnabled &&
              this.callState.isSupported
            ) {
              this.store.dispatch(new callAction.CheckDevices())
            }
          }
        })
      ),
    { dispatch: false }
  )

  fetchInitiatedCalls$ = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.FETCH_INITIATED_CALLS),
      debounceTime(300),
      map((action) => (action as any).payload),
      switchMap((payload) => {
        return from(this.conference.fetchCalls(payload)).pipe(
          map((response: FetchCallsResponse) => {
            return new callAction.FetchInitiatedCallsComplete({
              calls: response.data,
              initiator: payload.account
            })
          })
        )
      })
    )
  )

  updateInitiatedCallStatusToEnded$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.UPDATE_INITIATED_CALL_STATUS_TO_ENDED),
        debounceTime(300),
        map((action) => (action as any).payload),
        tap((updateCallRequest) =>
          this.conference.updateCall(updateCallRequest)
        )
      ),
    { dispatch: false }
  )

  fetchActiveCalls$ = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.FETCH_ACTIVE_CALLS),
      debounceTime(300),
      map((action) => (action as any).payload),
      switchMap((payload) => {
        return from(
          this.conference.fetchCalls({
            account: this.callState.callUserId,
            organization: this.callState.room.organizationId,
            status: 'in-progress'
          })
        ).pipe(
          map((response: FetchCallsResponse) => {
            if (response.data.length > 0) {
              return new callAction.UpdateActiveCallStatusToEnded({
                callId: `${response.data[0].id}`,
                participants: response.data[0].participants.requested.map(
                  (participant) => participant.id
                ),
                callEnded: true
              })
            } else {
              return new callAction.SaveCall({
                room: this.callState.room.name,
                participants: this.callState.room.participants.map(
                  (participant) => participant.id
                ),
                organization: this.context.organizationId
              })
            }
          })
        )
      })
    )
  )

  updateActiveCallStatusToEnded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.UPDATE_ACTIVE_CALL_STATUS_TO_ENDED),
      debounceTime(300),
      map((action) => (action as any).payload),
      switchMap((payload) => {
        return from(this.conference.updateCall(payload)).pipe(
          map(() => {
            return new callAction.SaveCall({
              room: this.callState.room.name,
              participants: this.callState.room.participants.map(
                (participant) => participant.id
              ),
              organization: this.context.organizationId
            })
          })
        )
      })
    )
  )

  applySelectedAudioDevice$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.APPLY_SELECTED_AUDIO_DEVICE),
        debounceTime(300),
        map((action) => (action as any).payload),
        tap((payload) => {
          this.notifierService.success(_('NOTIFY.SUCCESS.MICROPHONE_CHANGED'))
          if (this.callState.isMicrophoneEnabled) {
            this.twilioService.applyMicrophone(payload.deviceId)
          }

          if (!payload.closeSettings) {
            return
          }

          this.callLayoutService.closeSettings()
        })
      ),
    { dispatch: false }
  )

  applySelectedAudioOutputDevice$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.APPLY_SELECTED_AUDIO_OUTPUT_DEVICE),
        debounceTime(300),
        map((action) => (action as any).payload),
        tap((payload) => {
          this.notifierService.success(_('NOTIFY.SUCCESS.SPEAKER_CHANGES'))
          this.twilioService.applySpeakers(payload.deviceId)
        })
      ),
    { dispatch: false }
  )

  applySelectedVideoDevice$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.APPLY_SELECTED_VIDEO_DEVICE),
        debounceTime(300),
        map((action) => (action as any).payload),
        tap((payload) => {
          this.notifierService.success(_('NOTIFY.SUCCESS.CAMERA_CHANGED'))
          if (this.callState.isCameraEnabled) {
            this.twilioService.applyCamera(payload.deviceId)
          }
        })
      ),
    { dispatch: false }
  )

  closeSettings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.CLOSE_CALL_SETTINGS),
        debounceTime(300),
        map((action) => (action as any).payload),
        tap(() => this.callLayoutService.closeSettings())
      ),
    { dispatch: false }
  )

  abortCall$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.ABORT_CALL),
        debounceTime(300),
        map((action) => (action as any).payload),
        tap((payload) => {
          void this.interaction.createCallEvent({
            id: payload,
            event: 'aborted'
          })
        })
      ),
    { dispatch: false }
  )

  acceptCall$ = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.ACCEPT_CALL),
      debounceTime(300),
      switchMap(() => {
        void this.interaction.createCallEvent({
          id: this.callState.callId,
          event: 'participant-joined'
        })

        return [
          new callAction.FetchTwilioToken({
            id: this.callState.callId,
            account: this.context.accountId
          })
        ]
      })
    )
  )

  declineCall$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.DECLINE_CALL),
        debounceTime(300),
        map((action) => (action as any).payload),
        tap((payload) => {
          void this.logging.log({
            logLevel: 'info',
            data: {
              type: 'videoconferencing',
              functionType: 'declined-call',
              message: 'call has been declined',
              params: payload
            }
          })

          void this.interaction.createCallEvent({
            id: payload,
            event: 'declined'
          })
          this.twilioService.stopRinging()
          this.callLayoutService.closeCall()
        })
      ),
    { dispatch: false }
  )

  callDeclined$: Observable<Action> = createEffect(() =>
    this.conference.callDeclined$.pipe(
      skip(1),
      debounceTime(300),
      switchMap((decline) => {
        void this.logging.log({
          logLevel: 'info',
          data: {
            type: 'videoconferencing',
            functionType: 'recipient-declined-call',
            message: 'recipient has declined a call',
            id: decline.declinedBy.id
          }
        })

        this.showContactsNotAvailable()
        return of(new callAction.ParticipantDeclined(decline.declinedBy.id))
      })
    )
  )

  callAborted$ = createEffect(() =>
    this.conference.callAborted$.pipe(
      skip(1),
      debounceTime(300),
      switchMap((data) => {
        void this.logging.log({
          logLevel: 'info',
          data: {
            type: 'videoconferencing',
            functionType: 'twilio-call-aborted',
            message: 'call has been aborted'
          }
        })
        return [
          new callAction.UpdateCallStatusToEnded({
            callId: data.callId
          }),
          new CancelCall()
        ]
      })
    )
  )

  cancelCall$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.CANCEL_CALL),
        debounceTime(300),
        tap(() => {
          this.twilioService.disconnect()
          this.twilioService.stopRinging()
          this.callLayoutService.closeCall()
        })
      ),
    { dispatch: false }
  )

  participantConnected$: Observable<Action> = createEffect(() =>
    this.twilioService.participantConnected$.pipe(
      skip(1),
      debounceTime(300),
      flatMap((participant) => {
        const actions = []
        void this.logging.log({
          logLevel: 'info',
          data: {
            type: 'videoconferencing',
            functionType: 'twilio-participant-connected',
            message: 'twilio reports that a participant has joined the call',
            participant: participant
          }
        })
        actions.push(new callAction.ParticipantConnected(participant))
        actions.push(new callAction.SetAttemptingReconnect(false))

        return actions
      })
    )
  )

  twilioParticipantDisconnected$: Observable<Action> = createEffect(() =>
    this.twilioService.participantDisconnected$.pipe(
      skip(1),
      debounceTime(300),
      switchMap((participant) => {
        const persons = this.callState.room.participants.filter(
          (tParticipant) => tParticipant.callIdentity === participant
        )
        if (persons.length > 0) {
          const snack = (msg: string) => {
            this.notifierService.info(`${persons[0].name} ${msg}`, {
              log: true,
              data: {
                type: 'videoconferencing',
                functionType: 'twilio-participant-disconnected',
                message: 'twilio reports that a participant has disconnected',
                participants: persons
              }
            })
          }

          if (!this.callState.reconnectionBumper) {
            // support translatable strings starting with NOTIFY.
            this.translator
              .get([_('NOTIFY.INFO.HUNG_UP')])
              .subscribe((translations) => {
                snack(translations['NOTIFY.INFO.HUNG_UP'])
              })
          }
        }

        return of(new callAction.ParticipantDisconnected(participant))
      })
    )
  )

  participantEnabledCamera$: Observable<Action> = createEffect(() =>
    this.twilioService.trackEnabled$.pipe(
      skip(1),
      debounceTime(300),
      switchMap((participant) => {
        return of(new callAction.ParticipantEnabledCamera(participant))
      })
    )
  )

  participantDisabledCamera$: Observable<Action> = createEffect(() =>
    this.twilioService.trackDisabled$.pipe(
      skip(1),
      debounceTime(300),
      switchMap((participant) => {
        return of(new callAction.ParticipantDisabledCamera(participant))
      })
    )
  )

  participantStartedVideo$: Observable<Action> = createEffect(() =>
    this.twilioService.videoStarted$.pipe(
      skip(1),
      debounceTime(300),
      switchMap((participant) => {
        void this.logging.log({
          logLevel: 'info',
          data: {
            type: 'videoconferencing',
            functionType: 'twilio-participant-start-video',
            message: 'participant started video',
            participants: participant
          }
        })
        return of(new callAction.SetVideoAsStarted(participant))
      })
    )
  )

  participantStoppedVideo$: Observable<Action> = createEffect(() =>
    this.twilioService.videoStopped$.pipe(
      skip(1),
      debounceTime(300),
      switchMap((participant) => {
        void this.logging.log({
          logLevel: 'info',
          data: {
            type: 'videoconferencing',
            functionType: 'twilio-participant-stop-video',
            message: 'participant stopped video',
            participants: participant
          }
        })
        return of(new callAction.SetVideoAsStopped(participant))
      })
    )
  )

  participantDisconnected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.PARTICIPANT_DISCONNECTED),
      debounceTime(1500),
      map((action) => (action as callAction.ParticipantDisconnected).payload),
      flatMap((payload: string) => {
        const actionGroup = []
        if (
          !this.callState.reconnectionBumper &&
          this.callState.room.participants.filter(
            (participant) =>
              participant.isParticipating &&
              participant.id !== this.callState.callUserId
          ).length <= 1
        ) {
          if (this.callState.callId) {
            actionGroup.push(
              new callAction.UpdateCallStatusToEnded({
                callId: this.callState.callId
              })
            )
          }

          actionGroup.push(new callAction.PlayCallEndedAudio())
          actionGroup.push(new callAction.CallEmpty())
        } else if (this.callState.reconnectionBumper) {
          this.twilioService.setRemoteConnSkips()
          actionGroup.push(new callAction.SetReconnectionBumper(false))
        }
        return actionGroup
      })
    )
  )

  callEmpty$: Observable<Action> = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.CALL_EMPTY),
        debounceTime(300),
        tap(() => {
          this.twilioService.disconnect()
          this.callLayoutService.closeCall()
        })
      ),
    { dispatch: false }
  )

  checkUserAvailability$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.CHECK_USER_AVAILABILITY),
      map((action) => (action as any).payload),
      concatMap((payload) => {
        return from(this.interaction.getCallAvailability(payload)).pipe(
          map((response: GetCallAvailabilityResponse) => {
            if (response.isAvailable) {
              return new callAction.FlagUserAsAvailable(payload.account)
            } else {
              return new callAction.FlagUserAsUnavailable(payload.account)
            }
          }),
          catchError(() =>
            of(new callAction.FlagUserAsUnavailable(payload.account))
          )
        )
      })
    )
  )

  flagUserAsUnavailable$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.FLAG_USER_AS_UNAVAILABLE),
      switchMap(() => of(this.determineUserAvailabilityAction(false)))
    )
  )

  flagUserAsAvailable$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.FLAG_USER_AS_AVAILABLE),
      switchMap(() => of(this.determineUserAvailabilityAction(true)))
    )
  )

  determineUserAvailabilityAction(recentAvailability: boolean) {
    if (
      this.callState.room.participants.filter(
        (participant) => participant.hasFetchedStatus
      ).length === this.callState.room.participants.length
    ) {
      if (
        this.callState.room.participants.filter(
          (participant) =>
            participant.isAvailable &&
            participant.id !== this.callState.callUserId
        ).length === 0
      ) {
        this.showContactsNotAvailable()
        return new callAction.CancelCall()
      } else {
        return new callAction.FetchActiveCalls()
      }
    } else {
      return new callAction.NoAction()
    }
  }

  showContactsNotAvailable() {
    const participants = this.callState.room.participants.filter(
      (participant) => participant.id !== this.callState.callUserId
    )
    const snack = (msg: string) => {
      const names = participants
        .filter((participant) => participant.id !== this.callState.callUserId)
        .map((p) => p.name)
        .join(',')
      this.notifierService.info(`${names} ${msg}`)
    }
    this.translator
      .get([
        participants.length > 1
          ? _('NOTIFY.INFO.CONTACTS_NOT_AVAILABLE')
          : _('NOTIFY.INFO.CONTACT_NOT_AVAILABLE')
      ])
      .subscribe((translations) => {
        snack(
          participants.length > 1
            ? translations['NOTIFY.INFO.CONTACTS_NOT_AVAILABLE']
            : translations['NOTIFY.INFO.CONTACT_NOT_AVAILABLE']
        )
      })
  }

  closeCallsBeforeInitiate$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.CLOSE_CALLS_BEFORE_INITIATE),
      debounceTime(300),
      map((action) => (action as callAction.CloseCallsBeforeInitiate).payload),
      switchMap((payload) => {
        return from(
          this.conference.fetchCalls({
            account: payload.room.initiatorId,
            organization: payload.room.organizationId,
            status: 'in-progress'
          })
        ).pipe(
          flatMap((response: FetchCallsResponse) => {
            if (response.data.length > 0) {
              let actionGroup = []
              actionGroup.push(
                new callAction.SetCallEnd({
                  opened: response.data.length,
                  ended: 0
                })
              )
              actionGroup = actionGroup.concat(
                response.data.map(
                  (call) => new callAction.AttemptCloseCall(call.id)
                )
              )
              actionGroup.push(new callAction.SetAttemptingReconnect(false))
              return actionGroup
            } else {
              return of(this.initiatePendingCall())
            }
          }),
          catchError(() => of(this.initiatePendingCall()))
        )
      })
    )
  )

  attemptCloseCall$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.ATTEMPT_CLOSE_CALL),
      map((action) => (action as callAction.AttemptCloseCall).payload),
      concatMap((payload) => {
        return from(this.conference.attemptCloseCall(payload)).pipe(
          map(() =>
            this.callState.callEndState.ended >=
            this.callState.callEndState.opened
              ? this.initiatePendingCall()
              : new callAction.NoAction()
          ),
          catchError(() => of(new callAction.NoAction()))
        )
      })
    )
  )

  initiatePendingCall() {
    return new callAction.InitiateCall({
      participantIsAway: false,
      billableService: this.callState.billableService,
      callId: this.callState.callId,
      isReconnect: this.callState.isReconnect,
      source: this.callState.source,
      room: this.callState.room
    })
  }

  openCallBrowserSupport$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.OPEN_CALL_BROWSER_SUPPORT),
        debounceTime(300),
        tap(() => this.callLayoutService.openBrowserUnsupported())
      ),
    { dispatch: false }
  )

  recoverCall$: Observable<Action> = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.RECOVER_CALL),
        tap(() => {
          void this.callLayoutService.recoverCall()
        })
      ),
    { dispatch: false }
  )

  setAttemptingToReconnect$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(callAction.SET_ATTEMPTING_RECONNECT),
      flatMap(() => {
        const actions = []

        if (
          this.callState.isAttemptingToReconnect ||
          this.callState.participantIsAway
        ) {
          actions.push(new callAction.SetReconnectionBumper(true))
          this.twilioService.hideVideoContainer('')
        } else {
          actions.push(new callAction.SetReconnectionBumper(false))
          this.twilioService.showVideoContainer('')
        }
        return actions
      })
    )
  )

  storeCallSettings$: Observable<Action> = createEffect(
    () =>
      this.actions$.pipe(
        ofType(callAction.STORE_CALL_SETTINGS),
        tap(() => {
          window.localStorage.setItem(
            STORAGE_VIDEOCONFERENCE_SETTINGS,
            JSON.stringify({
              video: this.callState.isCameraEnabled,
              audio: this.callState.isMicrophoneEnabled,
              participantJoined: this.callState.participantJoined
            })
          )
        })
      ),
    { dispatch: false }
  )
}
