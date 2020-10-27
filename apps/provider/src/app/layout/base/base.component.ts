import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CCRPalette } from '@app/config';
import { UILayoutState, UIState } from '@app/layout/store';
import { FetchInitiatedCalls } from '@app/layout/store/call/call.action';
import { ContextService } from '@app/service/context.service';
import { TranslationsObject } from '@app/shared';
import { Store } from '@ngrx/store';
import { Conference } from 'selvera-api';

@Component({
  selector: 'app-layout-base',
  templateUrl: './base.component.html'
})
export class LayoutBaseComponent {
  @Input()
  layout: UILayoutState;
  @Input()
  lang: string;
  @Input()
  palette: CCRPalette;
  @Input()
  translations: TranslationsObject = {};

  @Output()
  openMenu = new EventEmitter<void>();

  panelEnabled: boolean = true;

  constructor(
    private context: ContextService,
    private callNotificationService: Conference,
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
    );
    this.callNotificationService.listenForCallNotifications();

    this.context.orphanedAccount$.subscribe((isOrphaned) => {
      this.panelEnabled = !isOrphaned;
    });
  }

  ngAfterViewInit() {}

  menuOpen(e: Event) {
    this.openMenu.next();
    e.stopPropagation();
  }
}
