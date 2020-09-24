import { cred, org, state } from '@coachcare/backend/tests';

import {
  CreateOrganizationPreferenceRequest,
  CreateOrganizationRequest,
  GetAllMeetingRequest,
  GetDescendantsOrganizationRequest,
  GetListOrganizationRequest,
  UpdateOrganizationPreferenceRequest,
  UpdateOrganizationRequest
} from '../../../providers';
import { Entity } from '../../../shared';

/**
 * Requests
 */

// Organization

export const getAllOrganizationRequest = (): GetAllMeetingRequest => ({
  limit: 10
});

export const getListOrganizationRequest = (): GetListOrganizationRequest => ({
  limit: 10
});

export const getDescendantsOrganizationRequest = (): GetDescendantsOrganizationRequest => ({
  id: state.role ? state[state.role].organizationId : org.id,
  limit: 10
});

export const createOrganizationRequest = (parent: string): CreateOrganizationRequest => ({
  name: 'API Test',
  shortcode: 'api_' + new Date().getTime(),
  contact: {
    email: state.role ? cred[state.role].email : org.id,
    firstName: 'API',
    lastName: 'Test'
  },
  parentOrganizationId: parent
});

export const updateOrganizationRequest = (): UpdateOrganizationRequest => ({
  id: state.role ? state[state.role].organizationId : org.id,
  name: 'Backend Test'
});

export const getOrganizationEntity = (): Entity => ({
  id: state.role ? state[state.role].organizationId : org.id
});

// Organization Preference

export const createPreferenceRequest = (): CreateOrganizationPreferenceRequest => ({
  id: state.role ? state[state.role].organizationId : org.id,
  logoBaseUrl: 'https://d3vngy9ttk2wws.cloudfront.net/3381/logo.png'
});

export const updatePreferenceRequest = (): UpdateOrganizationPreferenceRequest => ({
  id: state.role ? state[state.role].organizationId : org.id,
  logoBaseUrl: 'https://d3vngy9ttk2wws.cloudfront.net/30/logo.png'
});

export const getPreferenceEntity = (): Entity => ({
  id: state.role ? state[state.role].organizationId : org.id
});
