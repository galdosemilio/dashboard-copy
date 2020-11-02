/**
 * GET /content/form
 */

import { PagedResponse } from '../../content/entities/index';
import { FormSingle } from './form.single';

export type GetAllFormResponse = PagedResponse<FormSingle>;
