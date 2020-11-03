import { ApiService } from '../../services'
import { Entity } from '../common/entities'
import { PagedResponse } from '../content/entities'
import { ActiveCampaignListAssociationItem } from './entities'
import {
  CreateActiveCampaignListAssociationRequest,
  CreateNewsletterSubscriptionRequest,
  GetActiveCampaignListAssociationRequest,
  UpdateActiveCampaignListAssociationRequest
} from './requests'
import { GetActiveCampaignListsResponse } from './responses'

export class ActiveCampaign {
  public constructor(private readonly apiService: ApiService) {}

  public createListAssociation(
    request: CreateActiveCampaignListAssociationRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      method: 'POST',
      endpoint: '/active-campaign/list/association',
      version: '1.0'
    })
  }

  public createNewsletterSubscription(
    request: CreateNewsletterSubscriptionRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      method: 'POST',
      endpoint: '/active-campaign/newsletter/subscription',
      version: '1.0'
    })
  }

  public deleteListAssociation(request: Entity): Promise<void> {
    return this.apiService.request({
      data: request,
      method: 'DELETE',
      endpoint: `/active-campaign/list/association/${request.id}`,
      version: '1.0'
    })
  }

  public getLists(): Promise<GetActiveCampaignListsResponse> {
    return this.apiService.request({
      method: 'GET',
      endpoint: '/active-campaign/list',
      version: '1.0'
    })
  }

  public getListAssociation(
    request: GetActiveCampaignListAssociationRequest
  ): Promise<PagedResponse<ActiveCampaignListAssociationItem>> {
    return this.apiService.request({
      data: request,
      method: 'GET',
      endpoint: '/active-campaign/list/association',
      version: '1.0'
    })
  }

  public updateListAssociation(
    request: UpdateActiveCampaignListAssociationRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      method: 'PATCH',
      endpoint: `/active-campaign/list/association/${request.id}`,
      version: '1.0'
    })
  }
}
