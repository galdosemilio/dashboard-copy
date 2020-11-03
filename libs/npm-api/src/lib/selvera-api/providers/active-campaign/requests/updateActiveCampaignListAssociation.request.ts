export interface UpdateActiveCampaignListAssociationRequest {
    id: string;
    isActive?: boolean;
    list: {
        description?: string;
        name: string;
    };
}
