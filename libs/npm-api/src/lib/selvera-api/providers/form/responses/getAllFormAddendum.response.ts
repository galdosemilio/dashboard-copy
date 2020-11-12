/**
 * GET /content/form/addendum
 */

import { PagedResponse } from '../../content/entities'
import { FormAddendumSingle } from './formAddendum.single'

export type GetAllFormAddendumResponse = PagedResponse<FormAddendumSingle>
