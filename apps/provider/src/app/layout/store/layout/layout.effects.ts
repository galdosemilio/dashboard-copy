import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AppBreakpoints } from '@app/config';
import { ConfigService } from '@app/service/config.service';
import { EventsService } from '@app/service/events.service';
import * as layActions from './layout.action';
import { layoutSelector } from './layout.selector';
import { UILayoutState } from './layout.state';

@Injectable()
export class LayoutEffects {
  config: AppBreakpoints;
  state: UILayoutState;

  constructor(
    private actions$: Actions,
    private store: Store<UILayoutState>,
    config: ConfigService,
    bus: EventsService,
    @Inject(DOCUMENT) document: HTMLDocument
  ) {
    this.config = config.get('app.screen');

    bus.register('right-panel.component.set', this.activatePanel.bind(this));
    bus.register('right-panel.deactivate', this.deactivatePanel.bind(this));

    this.store.pipe(select(layoutSelector)).subscribe((state: UILayoutState) => {
      this.state = state;
    });
  }

  /**
   * Bus Events
   */
  activatePanel(component: string) {
    this.store.dispatch(new layActions.SetPanelComponent({ component }));
  }

  deactivatePanel() {
    this.store.dispatch(new layActions.DeactivatePanel());
  }

  /**
   * Handlers
   */
  initHandler() {
    const width = document.body.clientWidth;
    const state: UILayoutState = {
      menu: {
        opened: width < this.config.md ? false : true
      },
      panel: {
        opened: width < this.config.lg ? false : true,
        enabled: false,
        component: ''
      }
    };
    return of(new layActions.UpdateLayout(state));
  }

  resizeHandler() {
    const width = document.body.clientWidth;
    const state: UILayoutState = {
      menu: {
        opened: this.state.menu.opened && width >= this.config.md
      },
      panel: {
        opened: this.state.panel.opened && width >= this.config.md,
        enabled: this.state.panel.enabled,
        component: this.state.panel.component
      }
    };
    return of(new layActions.UpdateLayout(state));
  }

  closeMenuForHandler(screen = 'xs') {
    const width = document.body.clientWidth;
    const condition = this.config[screen] && width <= this.config[screen];
    return of(condition ? new layActions.CloseMenu() : { type: 'TAKE_NO_ACTION' });
  }

  /**
   * Effects
   */
  @Effect()
  init$: Observable<Action> = this.actions$.pipe(
    ofType(layActions.LAYOUT_INIT),
    switchMap(this.initHandler.bind(this))
  );

  @Effect()
  resize$: Observable<Action> = this.actions$.pipe(
    ofType(layActions.LAYOUT_RESIZE),
    switchMap(this.resizeHandler.bind(this))
  );

  @Effect()
  close$: Observable<Action> = this.actions$.pipe(
    ofType(layActions.MENU_CLOSE),
    map((action) => (action as layActions.CloseMenuFor).payload),
    switchMap(this.closeMenuForHandler.bind(this))
  );
}
