/**
 * GET /content/form/submission
 */

import { PagedResponse } from '../../content/entities'
import { FormSubmissionSegment } from '../entities'

export type GetAllFormSubmissionResponse = PagedResponse<FormSubmissionSegment>
