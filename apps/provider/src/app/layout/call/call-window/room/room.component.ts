import { Component, OnInit } from '@angular/core';

import { TwilioService } from '@app/layout/call/services/twilio.service';
import { UIState } from '@app/layout/store';
import { CallState, Source } from '@app/layout/store/call';
import {
  CREATE_LOCAL_TRACKS_COMPLETE,
  CREATE_LOCAL_TRACKS_FAILED,
  CREATE_ROOM_FAILED,
  CREATE_ROOM_SUCCESSFUL,
  CreateRoom,
  ParticipantConnected,
  PlayRingingAudio
} from '@app/layout/store/call/call.action';
import { callSelector } from '@app/layout/store/call/call.selector';
import { ContextService } from '@app/service';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  ConnectionStats,
  ConnectionStatus
} from 'selvera-api/dist/lib/selvera-api/processors/twilio/model';
import { TwilioBandwidthService } from '../../services/twilio-bandwidth.service';

@Component({
  selector: 'app-call-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  public callState: CallState;
  public localConnectionStatus: ConnectionStatus;
  public remoteConnectionStatus: ConnectionStatus;

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<UIState>,
    private twilioBandwidthService: TwilioBandwidthService,
    private twilioService: TwilioService,
    private actions$: Actions,
    private context: ContextService
  ) {
    this.subscriptions = [
      this.store
        .pipe(select(callSelector))
        .subscribe((callState) => (this.callState = callState))
    ];
  }

  ngOnInit() {
    const self = this;
    this.subscriptions = [
      ...this.subscriptions,
      this.actions$
        .pipe(
          ofType(CREATE_LOCAL_TRACKS_COMPLETE),
          tap((result) => {
            this.store.dispatch(new CreateRoom());
          })
        )
        .subscribe(),
      this.actions$
        .pipe(
          ofType(CREATE_LOCAL_TRACKS_FAILED),
          tap((result) => {
            this.store.dispatch(new CreateRoom());
          })
        )
        .subscribe(),
      this.actions$
        .pipe(
          ofType(CREATE_ROOM_SUCCESSFUL),
          tap(() => {
            if (self.callState.source === Source.INBOUND) {
              self.store.dispatch(
                new ParticipantConnected(self.callState.room.initiatorId)
              );
            }

            if (self.callState.source === Source.OUTBOUND) {
              self.store.dispatch(new PlayRingingAudio());
            }
          })
        )
        .subscribe(),
      this.actions$
        .pipe(
          ofType(CREATE_ROOM_FAILED),
          tap((result) => {
            self.twilioService.disconnect();
          })
        )
        .subscribe(),
      this.twilioBandwidthService.connectionUpdate$.subscribe((connStats) => {
        this.checkRemoteConnectivityStatus(connStats);
      })
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public getCurrentUserId() {
    return this.context.user.id;
  }

  private checkRemoteConnectivityStatus(allConnectionStats: ConnectionStats[]): void {
    const remoteConnStats = allConnectionStats.find(
      (connectionStats) => !connectionStats.isLocal
    );

    if (!remoteConnStats) {
      return;
    }

    this.remoteConnectionStatus = remoteConnStats.status;
  }
}
