import { Location } from '@angular/common'
import { Injectable } from '@angular/core'
import { NavigationExtras, Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import * as actions from './actions'

@Injectable()
export class RouterEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location
  ) {}

  /**
   * Router Effects.
   */

  // navigation

  navigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<actions.Go>(actions.ActionTypes.GO),
        map((action) => action.payload),
        tap(({ path, query: queryParams, extras }) => {
          const navExtras: NavigationExtras = { queryParams, ...extras }
          void this.router.navigate(path, navExtras)
        })
      ),
    { dispatch: false }
  )

  // back

  navigateBack$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.ActionTypes.BACK),
        tap(() => this.location.back())
      ),
    { dispatch: false }
  )

  // forward

  navigateForward$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.ActionTypes.FORWARD),
        tap(() => this.location.forward())
      ),
    { dispatch: false }
  )
}
