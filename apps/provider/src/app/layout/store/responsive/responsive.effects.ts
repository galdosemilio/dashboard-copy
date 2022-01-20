import { DOCUMENT } from '@angular/common'
import { Inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Action } from '@ngrx/store'
import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { AppBreakpoints } from '@app/config'
import { ConfigService } from '@app/service/config.service'
import * as layActions from '../layout/layout.action'
import * as resActions from './responsive.action'
import { UIResponsiveState } from './responsive.state'

@Injectable()
export class ResponsiveEffects {
  config: AppBreakpoints

  constructor(
    private actions$: Actions,
    config: ConfigService,
    @Inject(DOCUMENT) document: HTMLDocument
  ) {
    this.config = config.get('app.screen')
  }

  /**
   * Utilities
   */
  getSize(width: number) {
    if (width <= this.config.xs) {
      return 'xs'
    } else if (width <= this.config.sm) {
      return 'sm'
    } else if (width <= this.config.md) {
      return 'md'
    } else if (width <= this.config.lg) {
      return 'lg'
    }
    return 'xl'
  }

  /**
   * Handlers
   */
  updateHandler(): Observable<Action> {
    const width = document.body.clientWidth
    const state: UIResponsiveState = {
      screen: this.getSize(width),
      columns: width < this.config.md ? 2 : 4,
      colspan: width < this.config.md ? 1 : 2,
      rowspan: width < this.config.xs ? true : false
    }
    return of(new resActions.UpdateResponsive(state))
  }

  /**
   * Effects
   */

  init$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(layActions.LAYOUT_INIT),
      switchMap(this.updateHandler.bind(this))
    )
  )

  resize$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(layActions.LAYOUT_RESIZE),
      switchMap(this.updateHandler.bind(this))
    )
  )
}
