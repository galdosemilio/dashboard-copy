/**
 * GET /content/view
 */

import { PagedResponse } from '../../../shared';
import { ContentSingle } from '../../content/responses/content.single';

export type GetListContentResponse = PagedResponse<ContentSingle>;
