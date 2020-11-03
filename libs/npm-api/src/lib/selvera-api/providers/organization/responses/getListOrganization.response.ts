/**
 * GET /access/organization
 */

import { OrgListSegment } from '../../common/entities'
import { PagedResponse } from '../../content/entities'

export type GetListOrganizationResponse = PagedResponse<OrgListSegment>
