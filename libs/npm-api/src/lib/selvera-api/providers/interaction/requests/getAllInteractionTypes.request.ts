export interface GetAllInteractionTypesRequest {
    offset?: number;
    limit?: number | 'all';
    status?: 'active' | 'inactive' | 'all';
}
