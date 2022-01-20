import { Location } from '@angular/common'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Action } from '@ngrx/store'
import { map, tap } from 'rxjs/operators'
import * as RouterActions from './router.action'

@Injectable()
export class RouterEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location
  ) {}

  navigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.GO),
        map((action: Action) => (action as RouterActions.Go).payload),
        tap(({ path, query: queryParams, extras }) => {
          void this.router.navigate(path, { queryParams, ...extras })
        })
      ),
    { dispatch: false }
  )

  navigateBack$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.BACK),
        tap(() => this.location.back())
      ),
    { dispatch: false }
  )

  navigateForward$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.FORWARD),
        tap(() => this.location.forward())
      ),
    { dispatch: false }
  )
}
