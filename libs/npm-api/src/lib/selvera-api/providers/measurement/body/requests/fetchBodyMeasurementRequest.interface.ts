/**
 * Interface for GET /measurement/body
 */
import { IncludeRecord, RecordRequest, SortProperty } from '../entities';

export interface FetchBodyMeasurementRequest {
    account?: string;
    device?: string;
    recordedAt?: RecordRequest;
    includes?: IncludeRecord[];
    includeMode?: 'some' | 'all';
    limit?: number | 'all';
    sort?: SortProperty[];
    offset?: number;
}
