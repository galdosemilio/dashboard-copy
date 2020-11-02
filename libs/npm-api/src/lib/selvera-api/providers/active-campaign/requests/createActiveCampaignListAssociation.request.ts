export interface CreateActiveCampaignListAssociationRequest {
    isActive?: boolean;
    list: {
        id: string;
        name: string;
    };
    organization: string;
}
