import { org, state, user } from '@coachcare/backend/tests';
import { Organization, Session } from '../../../providers';
import { entityTest, setupTest, suiteLogin, suiteLogout } from '../../../shared/index.test';

import { organizationResponse } from '../../../providers/index.test';
import { createOrganizationRequest, getOrganizationEntity } from './organization.utils';

describe(`Organization >`, () => {
  let session: Session;
  let organization: Organization;

  beforeAll(done => {
    // create the services once
    setupTest().then(testBed => {
      session = testBed.get(Session);
      organization = testBed.get(Organization);
      done();
    });
  });

  it('setted up', function(done) {
    expect(session).toBeTruthy();
    expect(organization).toBeTruthy();
    done();
  });

  /**
   * Utilities
   */

  for (const testUser of [user.admin]) {
    describe(`${testUser.token} >`, function() {
      beforeAll(done => suiteLogin(done, session, testUser.token));
      afterAll(done => suiteLogout(done, session));

      switch (testUser.token) {
        case 'Admin':
          // TODO setup the provider permissions and client association
          it('Create', function(done) {
            organization
              .create(createOrganizationRequest(org.id))
              .then(entityTest)
              .then(res => {
                state[state.role].organizationId = res.id;
                done();
              })
              .catch(done.fail);
          });

          it('Get Single', function(done) {
            organization
              .getSingle(getOrganizationEntity())
              .then(organizationResponse)
              .then(done)
              .catch(done.fail);
          });
        default:
      }
    });
  }
});
