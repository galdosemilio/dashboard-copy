/**
 * GET /authentication/:account
 */

import { AuthSegment, ListResponse } from '../../../shared';

export type GetAvailableTokensExternalAuthResponse = ListResponse<AuthSegment>;
