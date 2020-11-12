import {
  AssignmentRequest,
  AssociationRequest,
  RemoveAssociationRequest,
  UpdateAssociationRequest
} from '../../providers/affiliation/requests'
import { ApiService } from '../../services/api.service'

/**
 * Account assignment and association posting/deleting/updating v2
 */
class Affiliation {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Create an assignment between a provider, organization, and client.
   * @param request must implement AssignmentRequest
   * @returns Promise<void>
   */
  public assign(request: AssignmentRequest): Promise<void> {
    return this.apiService.request({
      endpoint: '/assignment',
      method: 'POST',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Remove an assignment between a provider, organization, and client.
   * @param request must implement AssignmentRequest
   * @returns Promise<void>
   */
  public unassign(request: AssignmentRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/assignment/${request.client}/${request.provider}/${request.organization}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Assign an account (client or provider) to an organization.
   * @param request must implement AssociationRequest
   * @returns Promise<void>
   */
  public associate(request: AssociationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: '/association',
      method: 'POST',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Update an account association for an organization.
   * @param request must implement UpdateAssociationRequest
   * @returns Promise<void>
   */
  public update(request: UpdateAssociationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/association/${request.account}/${request.organization}`,
      method: 'PATCH',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Remove an account association for an organization.
   * @param request must implement RemoveAssociationRequest
   * @returns Promise<void>
   */
  public disassociate(request: RemoveAssociationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/association/${request.account}/${request.organization}`,
      method: 'DELETE',
      version: '2.0'
    })
  }
}

export { Affiliation }
