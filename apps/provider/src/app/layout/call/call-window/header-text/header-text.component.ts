import { Component, OnDestroy, OnInit } from '@angular/core'
import { callSelector } from '@app/layout/store/call/call.selector'
import { CallState } from '@app/layout/store/call/call.state'
import { UIState } from '@app/layout/store/state'
import { ContextService } from '@app/service/context.service'
import { select, Store } from '@ngrx/store'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: '[app-call-header-text]',
  templateUrl: './header-text.component.html',
  styleUrls: ['./header-text.component.scss']
})
export class CallHeaderTextComponent implements OnInit, OnDestroy {
  callState: CallState

  constructor(private store: Store<UIState>, private context: ContextService) {
    this.store
      .pipe(untilDestroyed(this), select(callSelector))
      .subscribe((callState) => (this.callState = callState))
  }

  ngOnInit() {}

  ngOnDestroy() {}

  getParticipantsText(): string {
    return this.callState.room.participants
      .filter((participant) => participant.id !== this.context.user.id)
      .map((participant) => participant.name)
      .join(',')
  }
}
