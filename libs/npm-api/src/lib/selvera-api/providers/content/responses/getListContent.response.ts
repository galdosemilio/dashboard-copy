/**
 * GET /content/view
 */

import { PagedResponse } from '../entities';
import { ContentSingle } from './content.single';

export type GetListContentResponse = PagedResponse<ContentSingle>;
