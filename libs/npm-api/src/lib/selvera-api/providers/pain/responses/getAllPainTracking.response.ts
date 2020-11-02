/**
 * GET /pain-tracking/history
 */

import { PagedResponse } from '../../content/entities';
import { PainTrackingSingle } from '../../pain/responses/painTracking.single';

export type GetAllPainTrackingResponse = PagedResponse<PainTrackingSingle>;
