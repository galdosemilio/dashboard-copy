interface Batch {
    total: number;
    failed: number;
}

export interface BulkOrganizationSeqEnrollmentsResponse {
    batches: Batch;
}
