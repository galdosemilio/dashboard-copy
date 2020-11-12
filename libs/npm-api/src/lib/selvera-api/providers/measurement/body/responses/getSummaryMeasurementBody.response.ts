/**
 * GET /measurement/body/summary
 */

import { ListResponse } from '../../../common/entities'
import { SummaryPair } from '../entities'

export type GetSummaryMeasurementBodyResponse = ListResponse<SummaryPair>
