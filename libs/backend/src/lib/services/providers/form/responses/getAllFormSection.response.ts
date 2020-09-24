/**
 * GET /content/form/section
 */

import { PagedResponse } from '../../../shared';
import { FormSectionSingle } from '../../form/responses/formSection.single';

export type GetAllFormSectionResponse = PagedResponse<FormSectionSingle>;
