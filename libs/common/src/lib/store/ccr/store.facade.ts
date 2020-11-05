import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { SessionActions, SessionSelectors, SessionState } from './session';
import { UserSelectors, UserState } from './user';

@Injectable()
export class CCRFacade {
  // Expose Queries

  // session
  lang$ = this.session.pipe(select(SessionSelectors.selectLanguage));
  accType$ = this.session.pipe(select(SessionSelectors.selectAccount));

  // user
  uid$ = this.user.pipe(select(UserSelectors.selectId));
  unit$ = this.user.pipe(select(UserSelectors.selectUnit));
  timezone$ = this.user.pipe(select(UserSelectors.selectTimezone));

  constructor(private session: Store<SessionState.State>, private user: Store<UserState.State>) {}

  // API
  changeLang(lang: string) {
    this.session.dispatch(new SessionActions.ChangeLang(lang));
  }

  dispatch(action) {
    this.session.dispatch(action);
  }
}
