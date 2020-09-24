import { cred, handleError, mustFail, state, user, voidTest } from '@coachcare/backend/tests';
import { Account, AccountPreference, Session } from '../../../providers';
import { entityTest, setupTest, suiteLogin, suiteLogout } from '../../../shared/index.test';

import {
  accountPreferenceResponse,
  accountResponse,
  getAllAccountResponse,
  getListAccountResponse,
  getTitlesAccountResponse,
  getTypesAccountResponse
} from '../../../providers/index.test';
import {
  checkRequest,
  createPreferenceRequest,
  createRequest,
  getAccountEntity,
  getAllRequest,
  getListRequest,
  getSortedListRequest,
  setActiveRequest,
  updatePreferenceRequest,
  updateRequest
} from './account.utils';

describe('Account >', () => {
  let session: Session;
  let account: Account;
  let accPreference: AccountPreference;

  beforeAll(done => {
    // create the services once
    setupTest().then(testBed => {
      session = testBed.get(Session);
      account = testBed.get(Account);
      accPreference = testBed.get(AccountPreference);
      done();
    });
  });

  it('setted up', function(done) {
    expect(session).toBeTruthy();
    expect(account).toBeTruthy();
    expect(accPreference).toBeTruthy();
    done();
  });

  /**
   * Roles Suites
   */
  describe(`Unauthenticated >`, () => {
    it('Check', function(done) {
      account
        .check(checkRequest())
        .then(mustFail(done))
        .catch(handleError(done, 'Endpoint not found'));
    });

    it('Create', function(done) {
      account
        .create(createRequest())
        .then(mustFail(done))
        .catch(handleError(done, 'You must be authenticated'));
    });

    it('Get All', function(done) {
      account
        .getAll(getAllRequest())
        .then(mustFail(done))
        .catch(handleError(done, 'You must be authenticated'));
    });

    it('Get List', function(done) {
      account
        .getList(getListRequest())
        .then(mustFail(done))
        .catch(handleError(done, 'You must be authenticated'));
    });

    it('Get Single', function(done) {
      account
        .getSingle(getAccountEntity())
        .then(mustFail(done))
        .catch(handleError(done, 'You must be authenticated'));
    });

    it('Update', function(done) {
      account
        .update(updateRequest(state.role))
        .then(mustFail(done))
        .catch(handleError(done, 'You must be authenticated'));
    });

    it('Set Active', function(done) {
      account
        .setActive(setActiveRequest())
        .then(mustFail(done))
        .catch(handleError(done, 'You must be authenticated'));
    });

    describe(`Preferences >`, function() {
      it('Create', function(done) {
        accPreference
          .create(createPreferenceRequest())
          .then(mustFail(done))
          .catch(handleError(done, 'You must be authenticated'));
      });

      it('Get Single', function(done) {
        accPreference
          .getSingle(getAccountEntity())
          .then(mustFail(done))
          .catch(handleError(done, 'You must be authenticated'));
      });

      it('Update', function(done) {
        accPreference
          .update(updatePreferenceRequest())
          .then(mustFail(done))
          .catch(handleError(done, 'You must be authenticated'));
      });
    });
  });

  describe(`Client >`, () => {
    beforeAll(done => suiteLogin(done, session, 'Client'));
    afterAll(done => suiteLogout(done, session));

    it('Check', function(done) {
      account
        .check(checkRequest())
        .then(voidTest)
        .then(done)
        .catch(done.fail);
    });

    it('Get List', function(done) {
      account
        .getList(getSortedListRequest())
        .then(getListAccountResponse)
        .then(done)
        .catch(handleError(done));
    });

    it('Get Single', function(done) {
      account
        .getSingle(getAccountEntity())
        .then(accountResponse)
        .then(done)
        .catch(done.fail);
    });

    it('Get Single', function(done) {
      account
        .getSingle({ id: cred.Provider.id })
        .then(mustFail(done))
        .catch(handleError(done, 'Cannot access data for a different account.'));
    });

    it('Create', function(done) {
      account
        .create(createRequest())
        .then(mustFail(done))
        .catch(handleError(done, 'Route access is restricted'));
    });
  });

  for (const testUser of [user.provider, user.admin]) {
    describe(`${testUser.token} >`, function() {
      beforeAll(done => suiteLogin(done, session, testUser.token));
      afterAll(done => suiteLogout(done, session));

      it('Check', function(done) {
        account
          .check(checkRequest())
          .then(voidTest)
          .then(done)
          .catch(done.fail);
      });

      it('Get Types', function(done) {
        account
          .getTypes()
          .then(getTypesAccountResponse)
          .then(done)
          .catch(done.fail);
      });

      it('Get Titles', function(done) {
        account
          .getTitles()
          .then(getTitlesAccountResponse)
          .then(done)
          .catch(done.fail);
      });

      it('Create', function(done) {
        account
          .create(createRequest())
          .then(entityTest)
          .then(res => {
            state[state.role].accountId = res.id;
            done();
          })
          .catch(done.fail);
      });

      it('Update', function(done) {
        account
          .update(updateRequest(testUser.token))
          .then(voidTest)
          .then(done)
          .catch(done.fail);
      });

      it('Get List', function(done) {
        account
          .getList(getListRequest())
          .then(getListAccountResponse)
          .then(done)
          .catch(done.fail);
      });

      it('Get Single', function(done) {
        account
          .getSingle(getAccountEntity())
          .then(accountResponse)
          .then(done)
          .catch(done.fail);
      });

      // tslint:disable-next-line:switch-default
      switch (testUser.token) {
        case 'Admin':
          it('Get All', function(done) {
            account
              .getAll(getAllRequest())
              .then(getAllAccountResponse)
              .then(done)
              .catch(done.fail);
          });

          it('Set Active', function(done) {
            account
              .setActive(setActiveRequest())
              .then(voidTest)
              .then(done)
              .catch(done.fail);
          });

          describe(`Preference >`, function() {
            it('Get Single', function(done) {
              accPreference
                .getSingle(getAccountEntity())
                .then(done)
                .catch(done);
            });

            it('Create', function(done) {
              accPreference
                .create(createPreferenceRequest())
                .then(entityTest)
                .then(done)
                .catch(handleError(done, 'Preference entry for an organization already exists'));
            });

            it('Update', function(done) {
              accPreference
                .update(updatePreferenceRequest())
                .then(voidTest)
                .then(done)
                .catch(done.fail);
            });

            it('Get Single', function(done) {
              accPreference
                .getSingle(getAccountEntity())
                .then(accountPreferenceResponse)
                .then(done)
                .catch(done.fail);
            });
          });
          break;

        case 'Provider':
          it('Get All', function(done) {
            account
              .getAll(getAllRequest())
              .then(mustFail(done))
              .catch(handleError(done, 'Route access is restricted'));
          });

          it('Set Active', function(done) {
            account
              .setActive(setActiveRequest())
              .then(mustFail(done))
              .catch(handleError(done, 'Route access is restricted'));
          });
          break;
      }
    });
  }
});
