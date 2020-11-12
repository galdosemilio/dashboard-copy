/**
 * GET /measurement/body/sampled
 */

import { ListResponse } from '../../../common/entities'
import { SampledRecord } from '../entities'

export type GetSampledMeasurementBodyResponse = ListResponse<SampledRecord>
