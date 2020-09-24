/**
 * GET /organization/:id/descendants
 */

import { OrgEntity, PagedResponse } from '../../../shared';

export type GetDescendantsOrganizationResponse = PagedResponse<OrgEntity>;
