/**
 * GET /measurement/body/sampled
 */

import { ListResponse, SampledEntry } from '../../../shared';

export type GetSampledMeasurementBodyResponse = ListResponse<SampledEntry>;
