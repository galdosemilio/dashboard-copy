/**
 * GET /pain-tracking/history
 */

import { PagedResponse } from '../../../shared';
import { PainTrackingSingle } from '../../pain/responses/painTracking.single';

export type GetAllPainTrackingResponse = PagedResponse<PainTrackingSingle>;
