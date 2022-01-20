import { Injectable } from '@angular/core'
import { AccountProvider, Session } from '@coachcare/sdk'
import { CcrRolesMap } from '@coachcare/common/shared'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Action } from '@ngrx/store'
import { defer, from, Observable, of as obsOf } from 'rxjs'
import { catchError, concatMap, switchMap } from 'rxjs/operators'

import { SessionActions, SessionState } from '@coachcare/backend/store/session'
import * as actions from './actions'

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private account: AccountProvider,
    private session: Session
  ) {}

  /**
   * Effects
   */

  init$: Observable<Action> = createEffect(() =>
    defer(() => from(this.session.check())).pipe(
      concatMap((res) => from(this.account.getSingle(res.id))),
      concatMap((res) => obsOf(new actions.LoadUser(res))),
      catchError((err) =>
        obsOf(new SessionActions.SessionLoaded({ loaded: true }))
      )
    )
  )

  loadUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<actions.LoadUser>(actions.ActionTypes.LOAD),
      switchMap((action) => {
        const langs = action.payload.preferredLocales
        const state: SessionState.State = {
          language: langs.length ? langs[0] : '',
          loaded: true,
          loggedIn: true,
          account: CcrRolesMap(action.payload.accountType.id)
        }
        return obsOf(new SessionActions.SessionLoaded(state))
      })
    )
  )

  login$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<SessionActions.Login>(SessionActions.ActionTypes.LOGIN),
      switchMap((action) => {
        return obsOf(new actions.UpdateUser(action.payload))
      })
    )
  )
}
