import { ApiService } from '../../services'
import { Entity, ListResponse, NamedEntity } from '../common/entities'
import { PagedResponse } from '../content/entities'
import {
  ProjectedTransition,
  TransitionHistory,
  TriggerHistoryItem
} from './entities'
import {
  BulkOrganizationSeqEnrollmentsRequest,
  CreateBulkSeqEnrollmentsRequest,
  CreateInactiveBulkSeqEnrollmentsRequest,
  CreateInactiveSeqEnrollmentRequest,
  CreateSeqEnrollmentRequest,
  CreateSeqOrgAssociationRequest,
  CreateSeqOrgPreferenceRequest,
  CreateSeqTransitionRequest,
  CreateSequenceCloneRequest,
  CreateSequenceRequest,
  CreateSequenceStateRequest,
  CreateSequenceTriggerLocaleRequest,
  CreateSequenceTriggerRequest,
  DeleteSeqTransitionRequest,
  DeleteSequenceTriggerLocaleRequest,
  DeleteSequenceTriggerRequest,
  GetAllSeqEnrollmentsRequest,
  GetAllSequencesRequest,
  GetSeqOrgPreferenceByOrg,
  GetSeqTransitionHistoryRequest,
  GetSeqTransitionPendingRequest,
  GetSeqTransitionRequest,
  GetSequenceRequest,
  GetSequenceStateRequest,
  GetSequenceTriggerHistoryRequest,
  GetSequenceTriggerRequest,
  GetTimeframedSeqEnrollmentsRequest,
  UpdateSeqOrgAssociationRequest,
  UpdateSeqOrgPreferenceRequest,
  UpdateSequenceRequest,
  UpdateSequenceStateRequest,
  UpdateSequenceTriggerMetadataRequest,
  UpdateSequenceTriggerRequest
} from './requests'
import {
  BulkOrganizationSeqEnrollmentsResponse,
  GetAllSeqEnrollmentsResponse,
  GetSeqOrgAssociationResponse,
  GetSeqOrgPreferenceResponse,
  GetSeqTransitionResponse,
  GetSequenceStateResponse,
  GetSequenceTriggerResponse
} from './responses'
import { GetSequenceResponse } from './responses/getSequence.response'

export class Sequence {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Create a 'bulk' Sequence Enrollment for multiple accounts
   * @param request must implement CreateBulkSeqEnrollmentsRequest
   * @returns Promise<void>
   */
  public createBulkSeqEnrollments(
    request: CreateBulkSeqEnrollmentsRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/enrollment/bulk',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Create a 'bulk' Sequence Enrollment for a single organization
   * @param request must implement CreateBulkOrganizationSeqEnrollmentsRequest
   * @returns Promise<void>
   */
  public createBulkOrganizationSeqEnrollments(
    request: BulkOrganizationSeqEnrollmentsRequest
  ): Promise<void | BulkOrganizationSeqEnrollmentsResponse> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/enrollment/bulk/organization',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Deactivates a Sequence Enrollment for all patients in an organization
   * @param request must implement CreateInactiveBulkSeqEnrollmentsRequest
   * @returns Promise<void>
   */
  public createInactiveBulkOrganizationSeqEnrollments(
    request: BulkOrganizationSeqEnrollmentsRequest
  ): Promise<void | BulkOrganizationSeqEnrollmentsResponse> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/enrollment/bulk/organization/inactive',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Deactivates a Sequence Enrollment by creating an inactive entry for multiple accounts
   * @param request must implement CreateInactiveBulkSeqEnrollmentsRequest
   * @returns Promise<void>
   */
  public createInactiveBulkSeqEnrollments(
    request: CreateInactiveBulkSeqEnrollmentsRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/enrollment/bulk/inactive',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Deactivates a Sequence Enrollment by creating an inactive entry
   * @param request CreateInactiveSeqEnrollmentRequest
   * @returns Promise<Entity>
   */
  public createInactiveSeqEnrollment(
    request: CreateInactiveSeqEnrollmentRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/enrollment/inactive',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Sets up a new Enrollment
   * @param request must implement CreateSeqEnrollmentRequest
   * @returns Promise<Entity>
   */
  public createSeqEnrollment(
    request: CreateSeqEnrollmentRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/enrollment',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Create a Sequence-Organization association
   * @param request must implement Promise<Entity>
   * @returns Promise<Entity>
   */
  public createSeqOrgAssociation(
    request: CreateSeqOrgAssociationRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/organization',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Creates a new Transition between two States in the same Sequence
   * @param request must implement CreateSeqTransitionRequest
   * @returns Promise<Entity>
   */
  public createSeqTransition(
    request: CreateSeqTransitionRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/transition',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Creates a new Sequence
   * @param request must implement CreateSequenceRequest
   * @returns Promise<Entity>
   */
  public createSequence(request: CreateSequenceRequest): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Sets up a new Sequence based on an existing Sequence.
   * Does not copy existing organization associations, nor sequence enrollments,
   * but associates the copy with the specified organization.
   * @param request must implement CreateSequenceCloneRequest
   * @returns Promise<Entity>
   */
  public createSequenceClone(
    request: CreateSequenceCloneRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/${request.id}/clone`,
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Creates a new Preference entry for an Organization, if it does not already exist
   * @param request must implement CreateSeqOrgPreferenceRequest
   * @returns Promise<Entity>
   */
  public createSeqOrgPreference(
    request: CreateSeqOrgPreferenceRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/preference/organization',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Creates a new State in a Sequence
   * @param request must implement CreateSequenceStateRequest
   * @returns Promise<Entity>
   */
  public createSequenceState(
    request: CreateSequenceStateRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/state',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Creates a new Trigger with a 'locale-default' payload if available
   * @param request must implement CreateSequenceTriggerRequest
   * @returns Promise<Entity>
   */
  public createSequenceTrigger(
    request: CreateSequenceTriggerRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/trigger',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Create or replace Trigger locale payload
   * @param request must CreateSequenceTriggerLocaleRequest
   * @returns Promise<void>
   */
  public createSequenceTriggerLocale(
    request: CreateSequenceTriggerLocaleRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/trigger/${request.id}/locale/${request.locale}`,
      method: 'PUT',
      version: '1.0'
    })
  }

  /**
   * Removes a Sequence-Organization Association
   * @param request must implement Entity
   * @returns Promise<void>
   */
  public deleteSeqOrgAssociation(request: Entity): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/organization/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Remove Preference entry for an Organization
   * @param request must implement Entity
   * @returns Promise<void>
   */
  public deleteSeqOrgPreference(request: Entity): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/preference/organization/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Remove a Transition
   * @param request must implement DeleteSeqTransitionRequest
   * @returns Promise<void>
   */
  public deleteSeqTransition(
    request: DeleteSeqTransitionRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/transition/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Remove a State
   * @param request must implement Entity
   * @returns Promise<void>
   */
  public deleteSequenceState(request: Entity): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/state/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Removes a Trigger
   * @param request must implement DeleteSequenceTriggerRequest
   * @returns Promise<void>
   */
  public deleteSequenceTrigger(
    request: DeleteSequenceTriggerRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/trigger/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Removes a localized payload entry for a Trigger
   * @param request must implement DeleteSequenceTriggerLocaleRequest
   * @returns Promise<void>
   */
  public deleteSequenceTriggerLocale(
    request: DeleteSequenceTriggerLocaleRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/trigger/${request.id}/locale/${request.locale}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Retrieves a list of Enrollments for a specific Sequence, Organization and Account
   * @param request must implement GetAllSeqEnrollmentsRequest
   * @returns Promise<PagedResponse<GetAllSeqEnrollmentsResponse>>
   */
  public getAllSeqEnrollments(
    request: GetAllSeqEnrollmentsRequest
  ): Promise<PagedResponse<GetAllSeqEnrollmentsResponse>> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/enrollment/audit',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Retrieves all Sequences for a given organization hierarchy
   * @param request must implement GetAllSequencesRequest
   * @returns Promise<PagedResponse<GetSequenceResponse>>
   */
  public getAllSequences(
    request: GetAllSequencesRequest
  ): Promise<PagedResponse<GetSequenceResponse>> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Retrieves available Trigger types
   * @returns Promise<ListResponse<NamedEntity>>
   */
  public getTriggerTypes(): Promise<ListResponse<NamedEntity>> {
    return this.apiService.request({
      endpoint: '/sequence/trigger/type',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Retrieves an Association between a Sequence and an Organization
   * @param request must implement Entity
   * @returs Promise<GetSeqOrgAssociationResponse>
   */
  public getSeqOrgAssociation(
    request: Entity
  ): Promise<GetSeqOrgAssociationResponse> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/organization/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Retrieve an existing Preference entry for an Organization
   * @param request must implement Entity
   * @returns Promise<GetSeqOrgPreferenceResponse>
   */
  public getSeqOrgPreference(
    request: Entity
  ): Promise<GetSeqOrgPreferenceResponse> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/preference/organization/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Retrieve a preference entry for an Organization hierarchy
   * @param request must implement GetSeqOrgPreferenceByOrg
   * @returns Promise<GetSeqOrgPreferenceResponse>
   */
  public getSeqOrgPreferenceByOrg(
    request: GetSeqOrgPreferenceByOrg
  ): Promise<GetSeqOrgPreferenceResponse> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/preference/organization',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Get a Transition between two States in an Organization context
   * @param request must GetSeqTransitionRequest
   * @returns Promise<GetSeqTransitionResponse>
   */
  public getSeqTransition(
    request: GetSeqTransitionRequest
  ): Promise<GetSeqTransitionResponse> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/transition/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Retrieves a Transition history for an Account and Sequence in an Organization Context
   * @param request must implement GetSeqTransitionHistoryRequest
   * @returns Promise<PagedResponse<TransitionHistory>>
   */
  public getSeqTransitionHistory(
    request: GetSeqTransitionHistoryRequest
  ): Promise<PagedResponse<TransitionHistory>> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/transition/history',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Get projected Transitions in a Sequence for an Account and Organization
   * @param request must implement GetSeqTransitionPendingRequest
   * @returns PagedResponse<ProjectedTransition>
   */
  public getSeqTransitionPending(
    request: GetSeqTransitionPendingRequest
  ): Promise<PagedResponse<ProjectedTransition>> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/transition/pending',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Retrieves a Sequence
   * @param request must implement GetSequenceRequest
   * @returns Promise<GetSequenceResponse>
   */
  public getSequence(
    request: GetSequenceRequest
  ): Promise<GetSequenceResponse> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Gets a State in an Organization context
   * @param request must implement GetSequenceStateRequest
   * @returns Promise<GetSequenceStateResponse>
   */
  public getSequenceState(
    request: GetSequenceStateRequest
  ): Promise<GetSequenceStateResponse> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/state/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Retrieves the Trigger with specified ID in an Organization context
   * @param request must implement GetSequenceTriggerRequest
   * @returns Promise<GetSequenceTriggerResponse>
   */
  public getSequenceTrigger(
    request: GetSequenceTriggerRequest
  ): Promise<GetSequenceTriggerResponse> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/trigger/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Get Trigger invocation history
   * @param request must implement GetSequenceTriggerHistoryRequest
   * @returns Promise<PagedResponse<TriggerHistoryItem>>
   */
  public getSequenceTriggerHistory(
    request: GetSequenceTriggerHistoryRequest
  ): Promise<PagedResponse<TriggerHistoryItem>> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/trigger/history',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Retrieves a list of Enrollments as of specific point in time for a particular Sequence-Organization
   * @param request must implement GetTimeframedSeqEnrollmentsRequest
   * @returns Promise<PagedResponse<GetAllSeqEnrollmentsResponse>>
   */
  public getTimeframedSeqEnrollment(
    request: GetTimeframedSeqEnrollmentsRequest
  ): Promise<PagedResponse<GetAllSeqEnrollmentsResponse>> {
    return this.apiService.request({
      data: request,
      endpoint: '/sequence/enrollment',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Updates an Association between a Sequence and an Organization
   * @param request must implement UpdateSeqOrgAssociationRequest
   * @returns Promise<Entity>
   */
  public updateSeqOrgAssociation(
    request: UpdateSeqOrgAssociationRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/organization/${request.id}`,
      method: 'PATCH',
      version: '1.0'
    })
  }

  /**
   * Updates an existing Preference entry for an Organization
   * @param request must implement UpdateSeqOrgPreferenceRequest
   * @returns Promise<void>
   */
  public updateSeqOrgPreference(
    request: UpdateSeqOrgPreferenceRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/preference/organization/${request.id}`,
      method: 'PATCH',
      version: '1.0'
    })
  }

  /**
   * Updates a Sequence
   * @param request must implement UpdateSequenceRequest
   * @returns Promise<void>
   */
  public updateSequence(request: UpdateSequenceRequest): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/${request.id}`,
      method: 'PATCH',
      version: '1.0'
    })
  }

  /**
   * Updates a State
   * @param request must implement UpdateSequenceStateRequest
   * @returns Promise<void>
   */
  public updateSequenceState(
    request: UpdateSequenceStateRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/state/${request.id}`,
      method: 'PATCH',
      version: '1.0'
    })
  }

  /**
   * Replaces payload on an existing Trigger
   * @param request must implement UpdateSequenceTriggerRequest
   * @returns Promise<void>
   */
  public updateSequenceTrigger(
    request: UpdateSequenceTriggerRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/trigger/${request.id}`,
      method: 'PUT',
      version: '1.0'
    })
  }

  /**
   * Updates metadata on an existing trigger.
   * @param request must implement UpdateSequenceTriggerMetadataRequest
   * @returns Promise<void>
   */
  public updateSequenceTriggerMetadata(
    request: UpdateSequenceTriggerMetadataRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/sequence/trigger/${request.id}`,
      method: 'PATCH',
      version: '1.0'
    })
  }
}
