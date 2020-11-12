/**
 * GET /food/consumed/type
 */

import { ListResponse } from '../../common/entities'
import { DescribedEntity } from '../../content/entities'

export type GetTypesFoodConsumedResponse = ListResponse<DescribedEntity>
