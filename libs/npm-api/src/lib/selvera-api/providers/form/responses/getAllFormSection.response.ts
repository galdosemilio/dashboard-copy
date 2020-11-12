/**
 * GET /content/form/section
 */

import { PagedResponse } from '../../content/entities'
import { FormSectionSingle } from './formSection.single'

export type GetAllFormSectionResponse = PagedResponse<FormSectionSingle>
