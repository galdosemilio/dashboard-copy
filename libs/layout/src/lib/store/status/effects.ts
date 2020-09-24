import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ConfigService } from '@coachcare/common/services';
import { AppBreakpoints } from '@coachcare/common/shared';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { defer, Observable, of as obsOf } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { State } from './state';

import * as actions from './actions';
import { selectStatus } from './selectors';

@Injectable()
export class LayoutEffects {
  config: AppBreakpoints;
  state: State;

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    config: ConfigService,
    @Inject(DOCUMENT) private document: HTMLDocument
  ) {
    this.config = config.get('app.screen');

    this.store.pipe(select(selectStatus)).subscribe((state: State) => (this.state = state));
  }

  /**
   * Effects
   */
  @Effect() init$: Observable<Action> = defer(() => this.initHandler());

  @Effect()
  resize$: Observable<Action> = this.actions$.pipe(
    ofType<actions.ResizeLayout>(actions.ActionTypes.LAYOUT_RESIZE),
    switchMap(() => this.resizeHandler())
  );

  @Effect()
  close$: Observable<Action> = this.actions$.pipe(
    ofType<actions.CloseMenuFor>(actions.ActionTypes.MENU_CLOSE),
    map(action => action.payload),
    switchMap(() => this.closeMenuForHandler())
  );

  /**
   * Handlers
   */
  initHandler() {
    const width = this.document.body.clientWidth;
    const state: State = {
      menu: {
        opened: width < this.config.md ? false : true
      },
      panel: {
        opened: width < this.config.lg ? false : true,
        enabled: false,
        component: ''
      }
    };
    return obsOf(new actions.UpdateLayout(state));
  }

  resizeHandler() {
    const width = this.document.body.clientWidth;
    const state: State = {
      menu: {
        opened: width < this.config.md ? false : true
      },
      panel: {
        opened: width < this.config.lg ? false : true,
        enabled: this.state.panel.enabled,
        component: this.state.panel.component
      }
    };
    return obsOf(new actions.UpdateLayout(state));
  }

  closeMenuForHandler(screen = 'xs') {
    const width = this.document.body.clientWidth;
    const condition = this.config[screen] && width <= this.config[screen];
    return obsOf(condition ? new actions.CloseMenu() : { type: 'TAKE_NO_ACTION' });
  }
}
