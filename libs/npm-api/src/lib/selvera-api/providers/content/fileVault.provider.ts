import { ApiService } from '../../services'
import { Entity } from '../common/entities'
import {
  CreateVaultContentRequest,
  GetAllVaultContentRequest,
  GetUploadUrlContentRequest,
  UpdateVaultContentRequest
} from './requests'
import {
  GetAllVaultContentResponse,
  GetDownloadUrlResponse,
  GetUploadUrlContentResponse,
  VaultContentSingle
} from './responses'

export class FileVault {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get a paged list of vault items at a given tree level
   * Retrieves a list of vault items at a specified tree level, or at the root. Lists multiple organizations by default.
   * List is sorted by default by `sortOrder` (top items), and then by `name`.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement GetAllVaultContentRequest
   * @return Promise<GetAllVaultContentResponse>
   */
  public getAll(
    request: GetAllVaultContentRequest
  ): Promise<GetAllVaultContentResponse> {
    return this.apiService.request({
      endpoint: `/content/vault`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }

  /**
   * Get a vault item
   * Retrieves a single vault item with a specific ID
   * Permissions: Admin, Provider
   *
   * @param request must implement Entity
   * @return Promise<VaultContentSingle>
   */
  public getSingle(request: Entity): Promise<VaultContentSingle> {
    return this.apiService.request({
      endpoint: `/content/vault/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Delete a vault item
   * Deletes the vault item with a specific ID. If the vault item has child items, all of them will be recursively deleted too. Only Admin or owner can delete the item.
   * Permissions: Admin, Provider
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/vault/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Create a vault item
   * Creates a new vault item for a specified organization at a given level in the item tree.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement CreateVaultContentRequest
   * @return Promise<Entity>
   */
  public create(request: CreateVaultContentRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/content/vault`,
      method: 'POST',
      version: '1.0',
      data: request
    })
  }

  /**
   * Update a vault item
   * Updates existing vault item.
   * Permissions: Admin, Provider
   *
   * @param request must implement UpdateVaultContentRequest
   * @return Promise<void>
   */
  public update(request: UpdateVaultContentRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/vault/${request.id}`,
      method: 'PATCH',
      version: '1.0',
      data: request
    })
  }

  /**
   * Generate a signed download URL for a vault file
   *
   * @param request must implemente Entity
   * @returns Promise<GetDownloadUrlResponse>
   */
  public getDownloadUrl(request: Entity): Promise<GetDownloadUrlResponse> {
    return this.apiService.request({
      endpoint: `/content/vault/${request.id}/url`,
      method: 'POST',
      version: '1.0',
      data: request
    })
  }

  /**
   * Generate signed URL for upload
   * Generates a signed URL that is valid for 15 minutes to upload a file to S3 directly.
   * Permissions: Admin, Provider
   *
   * @param request must implement GetUploadUrlContentRequest
   * @return Promise<GetUploadUrlContentResponse>
   */
  public getUploadUrl(
    request: GetUploadUrlContentRequest
  ): Promise<GetUploadUrlContentResponse> {
    return this.apiService.request({
      endpoint: `/content/vault/upload`,
      method: 'POST',
      version: '1.0',
      data: request
    })
  }
}
