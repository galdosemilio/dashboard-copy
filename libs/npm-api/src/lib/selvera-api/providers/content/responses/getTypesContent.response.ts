/**
 * GET /content/type
 */

import { ListResponse } from '../../common/entities'
import { ContentType } from '../entities'

export type GetTypesContentResponse = ListResponse<ContentType>
