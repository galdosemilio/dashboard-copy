import { ApiService } from '../../services/api.service';

import { CreateOrganizationAssignmentRequest, DeleteOrganizationAssignmentRequest } from './requests';

export class OrganizationAssignment {
    public constructor(private readonly apiService: ApiService) {}

    /**
     * Create an assignment between a provider, organization, and client.
     * A client can only have one provider assigned to them at a time.
     * Permissions: Admin, Provider, OrgAssignment, OrgAdmin
     *
     * @param request must implement CreateOrganizationAssignmentRequest
     * @return Promise<void>
     */
    public create(request: CreateOrganizationAssignmentRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/assignment`,
            method: 'POST',
            version: '2.0',
            data: request
        });
    }

    /**
     * Remove an assignment between a provider, organization, and client.
     * Providers can only delete assignments for their own organization.
     * Permissions: Admin, Provider, OrgAssignment, OrgAdmin
     *
     * @param request must implement DeleteOrganizationAssignmentRequest
     * @return Promise<void>
     */
    public delete(request: DeleteOrganizationAssignmentRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/assignment/${request.client}/${request.provider}/${request.organization}`,
            method: 'DELETE',
            version: '2.0'
        });
    }
}
