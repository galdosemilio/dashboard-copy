import { getTestBed } from '@angular/core/testing';

import { BackendModule } from '@coachcare/backend';
import { cred, environment, state, TestToken } from '@coachcare/backend/tests';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DoneFn } from 'jasmine-core';
import { LoginSessionRequest, Session } from '../providers';
import { AccountTypeIds, DeviceTypeIds } from './generic';

/**
 * Testing module definition
 * @param Services Required services to provide
 */
export function TestModule() {
  return {
    imports: [
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      BackendModule.forRoot(environment)
    ]
  };
}

/**
 * TestBed setup for beforeEach or beforeAll
 * @param Services Required services
 */
export function setupTest() {
  const testBed = getTestBed();

  testBed.resetTestingModule();
  testBed.configureTestingModule(TestModule());

  return testBed.compileComponents().then(() => testBed);
}

/**
 * Suite login async handler
 */
export const suiteLogin = (done: DoneFn, session: Session, token: TestToken) => {
  state.role = token;
  const creds = cred[state.role];

  const request: LoginSessionRequest = {
    email: creds.email,
    password: creds.password,
    deviceType: DeviceTypeIds.iOS,
    allowedAccountTypes: [AccountTypeIds.Client, AccountTypeIds.Provider, AccountTypeIds.Admin]
  };

  session
    .login(request)
    .then(done)
    .catch(done.fail);
};

/**
 * Suite logout async handler
 */
export const suiteLogout = (done: DoneFn, session: Session) => {
  session
    .logout()
    .then(done)
    .catch(done.fail);
};
