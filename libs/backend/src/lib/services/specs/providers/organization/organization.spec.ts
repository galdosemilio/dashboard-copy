import { handleError, mustFail, org, state, user, voidTest } from '@coachcare/backend/tests';
import { Organization, OrganizationPreference, Session } from '../../../providers';
import { entityTest, setupTest, suiteLogin, suiteLogout } from '../../../shared/index.test';

import {
  getAllOrganizationResponse,
  getAssetsOrganizationPreferenceResponse,
  getDescendantsOrganizationResponse,
  getListOrganizationResponse,
  organizationPreferenceResponse,
  organizationResponse
} from '../../../providers/index.test';
import {
  createOrganizationRequest,
  createPreferenceRequest,
  getAllOrganizationRequest,
  getDescendantsOrganizationRequest,
  getListOrganizationRequest,
  getOrganizationEntity,
  getPreferenceEntity,
  updateOrganizationRequest,
  updatePreferenceRequest
} from './organization.utils';

describe(`Organization >`, () => {
  let session: Session;
  let organization: Organization;
  let orgPreference: OrganizationPreference;

  beforeAll(done => {
    // create the services once
    setupTest().then(testBed => {
      session = testBed.get(Session);
      organization = testBed.get(Organization);
      orgPreference = testBed.get(OrganizationPreference);
      done();
    });
  });

  it('setted up', function(done) {
    expect(session).toBeTruthy();
    expect(organization).toBeTruthy();
    expect(orgPreference).toBeTruthy();
    done();
  });

  /**
   * Utilities
   */

  describe(`Unauthenticated >`, function() {
    it('Create', function(done) {
      organization
        .create(createOrganizationRequest(org.id))
        .then(mustFail(done, 'Unauthenticated request must fail'))
        .catch(handleError(done, 'You must be authenticated'));
    });

    it('Get All', function(done) {
      organization
        .getAll(getAllOrganizationRequest())
        .then(mustFail(done, 'Unauthenticated request must fail'))
        .catch(handleError(done, 'You must be authenticated'));
    });

    it('Get List', function(done) {
      organization
        .getList(getListOrganizationRequest())
        .then(mustFail(done, 'Unauthenticated request must fail'))
        .catch(handleError(done, 'You must be authenticated'));
    });

    it('Get Single', function(done) {
      organization
        .getSingle(getOrganizationEntity())
        .then(mustFail(done, 'Unauthenticated request must fail'))
        .catch(handleError(done, 'You must be authenticated'));
    });

    it('Update', function(done) {
      organization
        .update(updateOrganizationRequest())
        .then(mustFail(done, 'Unauthenticated request must fail'))
        .catch(handleError(done, 'You must be authenticated'));
    });

    it('Delete', function(done) {
      organization
        .delete(getOrganizationEntity())
        .then(mustFail(done, 'Unauthenticated request must fail'))
        .catch(handleError(done, 'You must be authenticated'));
    });
  });

  for (const testUser of [user.provider, user.admin]) {
    describe(`${testUser.token} >`, function() {
      beforeAll(done => suiteLogin(done, session, testUser.token));
      afterAll(done => suiteLogout(done, session));

      switch (testUser.token) {
        case 'Provider':
          it('Create', function(done) {
            organization
              .create(createOrganizationRequest(org.id))
              .then(mustFail(done, 'Provider create must fail'))
              .catch(handleError(done, 'Route access is restricted'));
          });

          it('Get List', function(done) {
            organization
              .getList(getListOrganizationRequest())
              .then(getListOrganizationResponse)
              .then(res => {
                console.log('Provider.list', res);
                if (!state[state.role].organizationId && res.data.length) {
                  state[state.role].organizationId = res.data[0].organization.id;
                }
                done();
              })
              .catch(done.fail);
          });
          break;

        case 'Admin':
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

          it('Get All', function(done) {
            organization
              .getAll(getAllOrganizationRequest())
              .then(getAllOrganizationResponse)
              .then(res => {
                console.log('Admin.All', res);
                if (!state[state.role].organizationId && res.data.length) {
                  state[state.role].organizationId = res.data[0].id;
                }
                done();
              })
              .catch(done.fail);
          });
        default:
      }

      it('Update', function(done) {
        organization
          .update(updateOrganizationRequest())
          .then(voidTest)
          .then(done)
          .catch(done.fail);
      });

      describe(`Preference >`, function() {
        it('Create', function(done) {
          orgPreference
            .create(createPreferenceRequest())
            .then(voidTest)
            .then(done)
            .catch(handleError(done, 'Preference entry for an organization already exists'));
        });

        it('Get Single', function(done) {
          orgPreference
            .getSingle(getPreferenceEntity())
            .then(organizationPreferenceResponse)
            .then(done)
            .catch(done.fail);
        });

        it('Update', function(done) {
          orgPreference
            .update(updatePreferenceRequest())
            .then(voidTest)
            .then(done)
            .catch(done.fail);
        });

        it('Get Assets', function(done) {
          orgPreference
            .getAssets(getPreferenceEntity())
            .then(getAssetsOrganizationPreferenceResponse)
            .then(done)
            .catch(done.fail);
        });
      });

      it('Get Single', function(done) {
        organization
          .getSingle(getOrganizationEntity())
          .then(organizationResponse)
          .then(done)
          .catch(done.fail);
      });

      it('Get Descendants', function(done) {
        organization
          .getDescendants(getDescendantsOrganizationRequest())
          .then(getDescendantsOrganizationResponse)
          .then(done)
          .catch(done.fail);
      });

      switch (testUser.token) {
        case 'Admin':
          for (const role of [user.provider, user.admin]) {
            it(`${role.token} Delete`, function(done) {
              if (!state[role.token.toLowerCase()].organizationId) {
                done();
                return;
              }
              organization
                .delete(getOrganizationEntity())
                .then(entityTest)
                .then(done)
                .catch(done.fail);
            });
          }
          break;
        default:
      }
    });
  }
});
