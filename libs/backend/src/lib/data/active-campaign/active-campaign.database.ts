import { Injectable } from '@angular/core'
import {
  ActiveCampaign,
  ActiveCampaignListAssociationItem,
  GetActiveCampaignListAssociationRequest,
  PagedResponse
} from '@coachcare/npm-api'

@Injectable()
export class ActiveCampaignDatabase {
  constructor(private activeCampaign: ActiveCampaign) {}

  fetch(
    args: GetActiveCampaignListAssociationRequest
  ): Promise<PagedResponse<ActiveCampaignListAssociationItem>> {
    return this.activeCampaign.getListAssociation(args)
  }
}
