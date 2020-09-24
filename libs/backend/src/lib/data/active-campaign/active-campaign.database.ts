import { Injectable } from '@angular/core';
import {
  ActiveCampaignListAssociationItem,
  GetActiveCampaignListAssociationRequest,
  PagedResponse
} from '@coachcare/backend/services';
import { ActiveCampaign } from 'selvera-api';

@Injectable()
export class ActiveCampaignDatabase {
  constructor(private activeCampaign: ActiveCampaign) {}

  fetch(
    args: GetActiveCampaignListAssociationRequest
  ): Promise<PagedResponse<ActiveCampaignListAssociationItem>> {
    return this.activeCampaign.getListAssociation(args);
  }
}
