/**
 * GET /content
 */

import { PagedResponse } from '../entities';
import { ContentSingle } from './content.single';

export type GetAllContentResponse = PagedResponse<ContentSingle>;
