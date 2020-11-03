import { TableDataSource } from '@coachcare/backend/model'
import {
  ActiveCampaignListAssociationItem,
  GetActiveCampaignListAssociationRequest,
  PagedResponse
} from '@coachcare/npm-api'
import { from, Observable } from 'rxjs'
import { ActiveCampaignDatabase } from './active-campaign.database'
import { ActiveCampaignListItem } from './model'

export class ActiveCampaignDataSource extends TableDataSource<
  ActiveCampaignListItem,
  PagedResponse<ActiveCampaignListAssociationItem>,
  GetActiveCampaignListAssociationRequest
> {
  public showMarker = false

  constructor(protected database: ActiveCampaignDatabase) {
    super()
  }

  defaultFetch(): PagedResponse<ActiveCampaignListAssociationItem> {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: GetActiveCampaignListAssociationRequest
  ): Observable<PagedResponse<ActiveCampaignListAssociationItem>> {
    return from(this.database.fetch(criteria))
  }

  mapResult(
    result: PagedResponse<ActiveCampaignListAssociationItem>
  ): ActiveCampaignListItem[] {
    // pagination handling
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset != undefined
      ? this.criteria.offset + result.data.length
      : 0

    const mappedData = result.data.map(
      (element) =>
        new ActiveCampaignListItem(element, {
          organizationId: this.criteria.organization || ''
        })
    )

    this.showMarker = mappedData.some((listItem) => listItem.isInherited)

    return mappedData
  }
}
