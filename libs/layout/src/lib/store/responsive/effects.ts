import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ConfigService } from '@coachcare/common/services';
import { AppBreakpoints } from '@coachcare/common/shared';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { defer, Observable, of as obsOf } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as layActions from '../status/actions';
import * as actions from './actions';
import { State } from './state';

@Injectable()
export class ResponsiveEffects {
  config: AppBreakpoints;

  constructor(
    private actions$: Actions,
    config: ConfigService,
    @Inject(DOCUMENT) document: HTMLDocument
  ) {
    this.config = config.get('app.screen');
  }

  /**
   * Effects
   */
  @Effect() init$: Observable<Action> = defer(() => this.updateHandler());

  @Effect()
  resize$: Observable<Action> = this.actions$.pipe(
    ofType(layActions.ActionTypes.LAYOUT_RESIZE),
    switchMap(() => this.updateHandler())
  );

  /**
   * Utilities
   */
  getSize(width: number) {
    if (width <= this.config.xs) {
      return 'xs';
    } else if (width <= this.config.sm) {
      return 'sm';
    } else if (width <= this.config.md) {
      return 'md';
    } else if (width <= this.config.lg) {
      return 'lg';
    }
    return 'xl';
  }

  /**
   * Handlers
   */
  updateHandler(): Observable<Action> {
    const width = document.body.clientWidth;
    const state: State = {
      screen: this.getSize(width),
      columns: width < this.config.md ? 2 : 4,
      colspan: width < this.config.md ? 1 : 2,
      rowspan: width < this.config.xs ? true : false
    };
    return obsOf(new actions.UpdateResponsive(state));
  }
}
