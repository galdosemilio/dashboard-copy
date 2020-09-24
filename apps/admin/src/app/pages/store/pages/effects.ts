import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AccountSingle, AccountTypeIds, MFA } from '@coachcare/backend/services';
import { CcrRolesMap } from '@coachcare/backend/shared';
import {
  AuthService,
  ContextService,
  COOKIE_CALL_BROWSERS_MODAL,
  COOKIE_CALL_DEVICES_MODAL,
  COOKIE_ROLE,
  CookieService
} from '@coachcare/common/services';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SessionActions } from '@coachcare/backend/store/session';

const MFASectionTypeIds = {
  Login: '1',
  PasswordUpdate: '2'
};

@Injectable()
export class PagesEffects {
  constructor(
    private actions$: Actions,
    private auth: AuthService,
    private context: ContextService,
    private cookie: CookieService,
    private mfa: MFA,
    private router: Router
  ) {}

  /**
   * Effects
   */
  @Effect({ dispatch: false })
  login$: Observable<Action> = this.actions$.pipe(
    ofType(SessionActions.ActionTypes.LOGIN),
    tap(async (action: SessionActions.Login) => {
      const enforceMFA = await this.detectRequiredMFA(action.payload);
      const payload: AccountSingle = action.payload;
      const role = CcrRolesMap(payload.accountType.id);
      this.cookie.set(COOKIE_ROLE, role, 1, '/');
      this.cookie.set(COOKIE_CALL_BROWSERS_MODAL, 'false', 365, '/');
      this.cookie.set(COOKIE_CALL_DEVICES_MODAL, 'false', 365, '/');

      if (enforceMFA) {
        this.router.navigate(['/mfa-setup']);
      } else {
        this.auth.login(role);
      }
    })
  );

  private async detectRequiredMFA(payload: SessionActions.Login['payload']): Promise<boolean> {
    return new Promise<boolean>(async resolve => {
      try {
        const response = await this.mfa.getMFAPreferenceAggregate({ account: payload.id });
        const providerRequiredOnLogin =
          !!response.data.find(
            section =>
              section.accountType.id === AccountTypeIds.Provider &&
              (section.section.id === MFASectionTypeIds.Login ||
                section.section.id === MFASectionTypeIds.PasswordUpdate) &&
              section.isRequired
          ) && !(await this.checkUserMFA());
        resolve(providerRequiredOnLogin || false);
      } catch (error) {
        resolve(false);
      }
    });
  }

  private async checkUserMFA(): Promise<boolean> {
    return new Promise<boolean>(async resolve => {
      try {
        const mfaPref = await this.mfa.getUserMFA({
          organization: this.context.organizationId || ''
        });
        if (mfaPref) {
          resolve(true);
        }
        resolve(false);
      } catch (error) {
        resolve(false);
      }
    });
  }
}
