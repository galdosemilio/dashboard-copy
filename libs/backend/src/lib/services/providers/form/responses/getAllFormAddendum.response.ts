/**
 * GET /content/form/addendum
 */

import { PagedResponse } from '../../../shared';
import { FormAddendumSingle } from '../../form/responses/formAddendum.single';

export type GetAllFormAddendumResponse = PagedResponse<FormAddendumSingle>;
