/**
 * Interface for GET /supplement/organization (Response)
 */

import { PagedResponse } from '../../content/entities';
import { FetchSupplementsSegment } from './fetchSupplementsSegment.interface';

export type FetchSupplementsResponse = PagedResponse<FetchSupplementsSegment>;
