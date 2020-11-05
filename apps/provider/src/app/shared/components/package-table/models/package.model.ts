import {
  ContentOrganization,
  FetchPackagesSegment,
  PackageOrganizationSingle
} from '@coachcare/npm-api'

interface PackageOptions {
  organizationId: string
}

export class Package implements FetchPackagesSegment {
  public associationId?: string
  public description?: string
  public id: string
  public title: string
  public shortcode: string
  public organization: ContentOrganization | any
  public createdAt: string
  public isActive: boolean
  public checked: boolean
  public isInherited: boolean

  constructor(
    args: any,
    raw?: PackageOrganizationSingle,
    opts: PackageOptions = { organizationId: '' }
  ) {
    this.associationId = raw.id
    this.description = args.description || ''
    this.id = args.id.toString()
    this.title = args.title
    this.shortcode = args.shortcode
    this.organization = args.organization || (raw && raw.organization)
    this.createdAt = args.createdAt
    this.isActive = args.isActive
    this.checked = args.checked
    this.isInherited = opts.organizationId !== raw.organization.id
  }
}
