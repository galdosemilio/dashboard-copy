export interface GetRPMDeactivationReasonsRequest {
    status?: 'active' | 'inactive' | 'all';
    limit?: number | 'all';
    offset?: number;
}
