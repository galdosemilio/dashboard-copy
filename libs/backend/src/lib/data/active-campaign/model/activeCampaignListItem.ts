import { NamedEntity } from '@coachcare/npm-api'

interface ActiveCampaignListItemOpts {
  organizationId: string
}

export class ActiveCampaignListItem {
  public id: string
  public isActive: boolean
  public isInherited: boolean
  public name: string
  public organization: NamedEntity

  constructor(
    args: any,
    opts: ActiveCampaignListItemOpts = { organizationId: '' }
  ) {
    this.id = args.id
    this.isActive = args.isActive
    this.isInherited = opts.organizationId !== args.organization.id
    this.name = args.list.name
    this.organization = args.organization
  }
}
