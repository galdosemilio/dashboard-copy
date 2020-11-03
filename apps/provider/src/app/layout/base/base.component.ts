import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core'

import { CCRPalette } from '@app/config'
import { UILayoutState, UIState } from '@app/layout/store'
import { FetchInitiatedCalls } from '@app/layout/store/call/call.action'
import { EventsService } from '@app/service'
import { ContextService } from '@app/service/context.service'
import { TranslationsObject } from '@app/shared'
import { Store } from '@ngrx/store'
import { Conference } from 'selvera-api'

@Component({
  selector: 'app-layout-base',
  templateUrl: './base.component.html'
})
export class LayoutBaseComponent implements AfterViewInit, OnInit {
  @Input()
  layout: UILayoutState
  @Input()
  lang: string
  @Input()
  palette: CCRPalette
  @Input()
  translations: TranslationsObject = {}

  @Output()
  openMenu = new EventEmitter<void>()

  panelEnabled = true
  showVideoRating = false

  constructor(
    private context: ContextService,
    private callNotificationService: Conference,
    private events: EventsService,
    private store: Store<UIState>
  ) {}

  ngOnInit() {
    // FIXME add because current user id is not in global store yet
    this.store.dispatch(
      new FetchInitiatedCalls({
        account: this.context.user.id,
        organization: this.context.organizationId,
        status: 'in-progress'
      })
    )
    this.callNotificationService.listenForCallNotifications()

    this.context.orphanedAccount$.subscribe((isOrphaned) => {
      this.panelEnabled = !isOrphaned
    })

    this.events.listen(
      'videoconferencing.ratingWindow.setState',
      this.setRatingWindowState.bind(this)
    )
  }

  ngAfterViewInit() {}

  menuOpen(e: Event) {
    this.openMenu.next()
    e.stopPropagation()
  }

  private setRatingWindowState(openState: boolean = false): void {
    this.showVideoRating = openState
  }
}
