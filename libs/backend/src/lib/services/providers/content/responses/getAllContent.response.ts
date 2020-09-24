/**
 * GET /content
 */

import { PagedResponse } from '../../../shared';
import { ContentSingle } from '../../content/responses/content.single';

export type GetAllContentResponse = PagedResponse<ContentSingle>;
