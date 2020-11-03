export interface FetchBodyMeasurementRequestV1 {
    account?: string;
    startDate?: string;
    endDate?: string;
    max?: number | 'all';
    direction?: 'asc' | 'desc';
    device?: number;
}
