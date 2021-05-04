import {
  AllOrgPermissions,
  GetAllOrganizationRequest,
  GetListOrganizationRequest,
  OrganizationSingle,
  OrgSegment
} from '@coachcare/sdk'
import { BehaviorSubject } from 'rxjs'

// DataSource

export type OrganizationsCriteria = GetListOrganizationRequest &
  GetAllOrganizationRequest & {
    isAdmin: boolean
  }

export type GetListSegment = OrgSegment & {
  permissions?: Partial<AllOrgPermissions>
  isDirect: boolean
}

// Tree

export type NodeType = 'parentNode' | 'childNode' | 'leafNode' | 'emptyNode'

export class ClinicNode {
  childrenChange = new BehaviorSubject<ClinicNode[]>([])

  get children(): ClinicNode[] {
    return this.childrenChange.value
  }

  constructor(
    public nodeName: string,
    public nodeType: NodeType,
    public org: OrganizationSingle,
    public loadMoreParentItem: string | null = null
  ) {}
}

export class ClinicFlatNode {
  public nodeName: string
  public nodeType: NodeType
  public org: OrganizationSingle
  public loadMoreParentItem: string | null = null
}
