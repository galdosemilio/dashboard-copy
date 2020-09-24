/**
 * GET /content/form
 */

import { PagedResponse } from '../../../shared';
import { FormSingle } from '../../form/responses/form.single';

export type GetAllFormResponse = PagedResponse<FormSingle>;
