import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'
import {
  CopyContentRequest,
  CreateContentRequest,
  GetAllContentRequest,
  GetListContentRequest,
  GetUploadUrlContentRequest,
  UpdateContentRequest
} from './requests'
import {
  ContentSingle,
  GetAllContentResponse,
  GetListContentResponse,
  GetTypesContentResponse,
  GetUploadUrlContentResponse
} from './responses'

export class Content {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Retrieves a list of content items at a specified tree level, or at the root. Lists multiple organizations by default.
   * Only public items or items that have specific package associations will be listed.
   * The enrollments will be fetched automatically.
   * Permissions: Client
   *
   * @param request must implement GetListContentRequest
   * @return Promise<GetListContentResponse>
   */
  public getList(
    request: GetListContentRequest
  ): Promise<GetListContentResponse> {
    return this.apiService.request({
      endpoint: `/content/view`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }

  /**
   * Retrieves a list of content items at a specified tree level, or at the root. Lists multiple organizations by default.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement GetAllContentRequest
   * @return Promise<GetAllContentResponse>
   */
  public getAll(request: GetAllContentRequest): Promise<GetAllContentResponse> {
    return this.apiService.request({
      endpoint: `/content`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }

  /**
   * Retrieves a single content item with a specific ID.
   * Permissions: Admin, Provider
   *
   * @param request must implement Entity
   * @return Promise<ContentSingle>
   */
  public getSingle(request: Entity): Promise<ContentSingle> {
    return this.apiService.request({
      endpoint: `/content/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Deletes the content item with a specific ID.
   * If the content item has child items, all of them will be recursively deleted too.
   * Permissions: Admin, Provider
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Creates a new content item for a specified organization at a given level in the content tree.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement CreateContentRequest
   * @return Promise<Entity>
   */
  public create(request: CreateContentRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/content/`,
      method: 'POST',
      version: '1.0',
      data: request
    })
  }

  /**
   * Updates existing content item.
   * Permissions: Admin, Provider
   *
   * @param request must implement UpdateContentRequest
   * @return Promise<void>
   */
  public update(request: UpdateContentRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/${request.id}`,
      method: 'PATCH',
      version: '1.0',
      data: request
    })
  }

  /**
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
      endpoint: `/content/upload`,
      method: 'POST',
      version: '1.0',
      data: request
    })
  }

  /**
   * Retrieves a list of content item types.
   * Permissions: Admin, Provider
   *
   * @return Promise<GetTypesContentResponse>
   */
  public getTypes(): Promise<GetTypesContentResponse> {
    return this.apiService.request({
      endpoint: `/content/type`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Copies a content item (recursively, in case of directories) to a given organization and level in the content tree.
   * @param request must implement CopyContentRequest
   * @returns Promise<Entity>
   */
  public copy(request: CopyContentRequest): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: `/content/copy/${request.id}`,
      method: 'POST',
      version: '1.0'
    })
  }
}
