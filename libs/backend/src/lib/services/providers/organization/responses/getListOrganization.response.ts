/**
 * GET /access/organization
 */

import { OrgListSegment, PagedResponse } from '../../../shared';

export type GetListOrganizationResponse = PagedResponse<OrgListSegment>;
