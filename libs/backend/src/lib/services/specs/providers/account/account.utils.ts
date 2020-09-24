import { cred, state } from '@coachcare/backend/tests';

import {
  CheckAccountRequest,
  CreateAccountPreferenceRequest,
  CreateAccountRequest,
  GetAllAccountRequest,
  GetListAccountRequest,
  SetActiveAccountRequest,
  UpdateAccountPreferenceRequest,
  UpdateAccountRequest
} from '../../../providers';
import { AccountTypeIds, Entity } from '../../../shared';

/**
 * Requests
 */

// Account

export const checkRequest = (): CheckAccountRequest => ({
  email: state.role ? cred[state.role].email : 'non-existing@coachcare.io'
});

export const createRequest = (): CreateAccountRequest => ({
  firstName: 'Test',
  lastName: 'Account',
  email: `backend-${new Date().getTime()}@coachcare.com`,
  accountType: AccountTypeIds.Client,
  phone: '123-456-7890',
  phoneType: 'android',
  measurementPreference: 'us',
  timezone: 'America/New_York',
  client: {
    birthday: '1986-12-09',
    height: 165,
    gender: 'female'
  }
});

export const updateRequest = (role: string): UpdateAccountRequest => ({
  id: state.role ? state[state.role].accountId : cred.Client.id,
  firstName: role,
  lastName: 'Tested'
});

export const getAllRequest = (): GetAllAccountRequest => ({
  accountType: AccountTypeIds.Admin
});

export const getListRequest = (accountId?: string): GetListAccountRequest => ({
  account: accountId,
  accountType: AccountTypeIds.Client
});

export const getSortedListRequest = (): GetListAccountRequest => ({
  account: cred.Client.id,
  accessType: 'assignment',
  sort: [
    {
      property: 'associationDate',
      dir: 'desc'
    }
  ]
});

export const setActiveRequest = (): SetActiveAccountRequest => ({
  id: state.role ? state[state.role].accountId : cred.Client.id,
  isActive: false
});

export const getAccountEntity = (): Entity => ({
  id: state.role ? state[state.role].accountId : cred.Client.id
});

// Account Preference

export const createPreferenceRequest = (): CreateAccountPreferenceRequest => ({
  id: state.role ? state[state.role].accountId : cred.Client.id,
  calendarView: 'list'
});

export const updatePreferenceRequest = (): UpdateAccountPreferenceRequest => ({
  id: state.role ? state[state.role].accountId : cred.Client.id,
  healthyBadgeStation: 'badge'
});
