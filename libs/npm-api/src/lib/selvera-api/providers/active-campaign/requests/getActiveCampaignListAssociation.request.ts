export interface GetActiveCampaignListAssociationRequest {
    limit?: number | 'all';
    offset?: number;
    organization?: string;
    status?: 'active' | 'all' | 'inactive';
}
