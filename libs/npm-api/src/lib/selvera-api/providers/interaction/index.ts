import { ApiService } from '../../services'
import { Entity } from '../common/entities'
import { PagedResponse } from '../content/entities'
import { BillableService, InteractionSingle, InteractionType } from './entities'
import {
  CreateCallEventRequest,
  CreateCallInteractionRequest,
  CreateCallTokenRequest,
  CreateManualInteractionRequest,
  GetAllInteractionsRequest,
  GetAllInteractionTypesRequest,
  GetBillableServicesRequest,
  GetCallAvailabilityRequest,
  UpdateInteractionRequest
} from './requests'
import {
  CreateCallTokenResponse,
  GetCallAvailabilityResponse
} from './responses'

export class Interaction {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Attemps to end the call. Call will be closed if there are fewer than 2 participants left.
   * @param request must implement interface Entity
   * @returns Promise<void>
   */
  public attemptCallEnd(request: Entity): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/communication/interaction/call/${request.id}/end`,
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Creates a new Twilio call interaction
   * @param request must implement CreateCallInteractionRequest
   * @returns Promise<Entity>
   */
  public createCall(request: CreateCallInteractionRequest): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/communication/interaction/call',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Raises an event for a call
   * @param request must implement CreateCallEventRequest
   * @returns Promise<void>
   */
  public createCallEvent(request: CreateCallEventRequest): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/communication/interaction/call/${request.id}/event`,
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Generates a JWT access token to join a call
   * @param request must implement CreateCallTokenRequest
   * @returns Promise<CreateCallTokenResponse>
   */
  public createCallToken(
    request: CreateCallTokenRequest
  ): Promise<CreateCallTokenResponse> {
    return this.apiService.request({
      data: request,
      endpoint: `/communication/interaction/call/${request.id}/token`,
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Creates a new manual interaction entry
   * @param request must implement CreateManualInteractionRequest
   * @returns Promise<Entity>
   */
  public createManual(
    request: CreateManualInteractionRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/communication/interaction/manual',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Attempts to remove a selected interaction.
   * Not all interaction sources support removal.
   * Interactions that were already processed by RPM will not be removable.
   * @param request must implement Entity
   * @returns Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/communication/interaction/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Fetch multiple interaction entries as a paginated list
   * @param request must implement GetAllInteractionsRequest
   * @returns Promise<PagedResponse<InteractionSingle>>
   */
  public getAll(
    request: GetAllInteractionsRequest
  ): Promise<PagedResponse<InteractionSingle>> {
    return this.apiService.request({
      data: request,
      endpoint: '/communication/interaction',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Fetch multiple interaction entries as a paginated list for the current account
   * ADMINS can select any account but other account types will default to the current
   * account
   * @param request must implement GetAllInteractionsRequest
   * @returns PagedResponse<InteractionSingle>
   */
  public getAllSelf(
    request: GetAllInteractionsRequest
  ): Promise<PagedResponse<InteractionSingle>> {
    return this.apiService.request({
      data: request,
      endpoint: '/communication/interaction/self',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Fetch multiple interaction type entries as a paginated list
   * @param request must implement GetAllInteractionTypesRequest
   * @returns PagedReponse<InteractionType>
   */
  public getAllInteractionTypes(
    request: GetAllInteractionTypesRequest
  ): Promise<PagedResponse<InteractionType>> {
    return this.apiService.request({
      data: request,
      endpoint: '/communication/interaction/type',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Fetch multiple interaction billable service entries as a paginated list
   * @param request must implement GetBillableServicesRequest
   * @returns PagedResponse<BillableService>
   */
  public getBillableServices(
    request: GetBillableServicesRequest
  ): Promise<PagedResponse<BillableService>> {
    return this.apiService.request({
      data: request,
      endpoint: '/communication/interaction/billable-service',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Checks if a specified user is currently available, or in a call
   * @param request must implement GetCallAvailability
   */
  public getCallAvailability(
    request: GetCallAvailabilityRequest
  ): Promise<GetCallAvailabilityResponse> {
    return this.apiService.request({
      data: request,
      endpoint: '/communication/interaction/call/availability',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Attempts to update a selected interaction, mostly the RPM applicability flag.
   * The flag is not going to be editable for interactions already potentially processed for RPM billing purposes.
   * @param request must implement UpdateInteractionRequest
   * @returns Promise<void>
   */
  public update(request: UpdateInteractionRequest): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/communication/interaction/${request.id}`,
      method: 'PATCH',
      version: '1.0'
    })
  }
}
