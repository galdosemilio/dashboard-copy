import { Component, Input, OnInit } from '@angular/core';

import { TwilioService } from '@app/layout/call/services/twilio.service';
import { UIState } from '@app/layout/store';
import { CallState } from '@app/layout/store/call';
import { CloseCallsBeforeInitiate, Source } from '@app/layout/store/call/call.action';
import { callSelector } from '@app/layout/store/call/call.selector';
import { ContextService } from '@app/service';
import { _ } from '@app/shared/utils/i18n.utils';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ccr-call-control',
  templateUrl: './call-control.component.html',
  styleUrls: ['./call-control.component.scss']
})
export class CcrCallControlComponent {
  callState: CallState;

  @Input()
  mode = 0;
  @Input()
  targets;

  subscriptions: Subscription[];
  toolTipMessage: string;

  constructor(
    private store: Store<UIState>,
    private context: ContextService,
    private twilioService: TwilioService,
    private translator: TranslateService
  ) {
    this.subscriptions = [
      this.store.pipe(select(callSelector)).subscribe((callState) => {
        this.callState = callState;

        if (this.callState.subaccountId === '') {
          if (this.callState.isSupported) {
            this.translator.get([_('CALL.CONFERENCE_DISABLED')]).subscribe((i18n) => {
              this.toolTipMessage = i18n['CALL.CONFERENCE_DISABLED'];
            });
          }
        } else {
          this.toolTipMessage = '';
        }
      })
    ];
  }

  onClick() {
    this.store.dispatch(
      new CloseCallsBeforeInitiate({
        callId: '',
        isReconnect: false,
        source: Source.OUTBOUND,
        room: {
          name: this.twilioService.createRoomName(this.context.user.id),
          organizationId: this.context.organizationId,
          initiatorId: this.context.user.id,
          participants: [
            ...this.targets.map((participant) => {
              return {
                id: participant.id,
                name: participant.firstName,
                isAvailable: false,
                isParticipating: false,
                hasFetchedStatus: false,
                callIdentity: ''
              };
            }),
            {
              id: this.context.user.id,
              name: `${
                this.context.user.firstName
              } ${this.context.user.lastName[0].toUpperCase()}.`,
              isAvailable: false,
              isParticipating: false,
              hasFetchedStatus: false,
              callIdentity: ''
            }
          ]
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
