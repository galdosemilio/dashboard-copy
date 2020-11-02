/**
 * GET /organization/
 */

import { OrgEntityExtended } from '../../common/entities'
import { PagedResponse } from '../../content/entities'

export type GetAllOrganizationResponse = PagedResponse<OrgEntityExtended>
