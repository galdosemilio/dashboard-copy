import { Location } from '@angular/common'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, Effect, ofType } from '@ngrx/effects'
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

  @Effect({ dispatch: false })
  navigate$ = this.actions$.pipe(
    ofType(RouterActions.GO),
    map((action: Action) => (action as RouterActions.Go).payload),
    tap(({ path, query: queryParams, extras }) => {
      void this.router.navigate(path, { queryParams, ...extras })
    })
  )

  @Effect({ dispatch: false })
  navigateBack$ = this.actions$.pipe(
    ofType(RouterActions.BACK),
    tap(() => this.location.back())
  )

  @Effect({ dispatch: false })
  navigateForward$ = this.actions$.pipe(
    ofType(RouterActions.FORWARD),
    tap(() => this.location.forward())
  )
}
