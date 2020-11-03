import { ApiService } from '../../services/api.service';

import {
    CreateOrganizationAssociationRequest,
    DeleteOrganizationAssociationRequest,
    UpdateOrganizationAssociationRequest
} from './requests';

export class OrganizationAssociation {
    public constructor(private readonly apiService: ApiService) {}

    /**
     * Associate an account (client or provider) to an organization.
     * Permissions: Admin, Provider, OrgAdmin
     *
     * @param request must implement CreateOrganizationAssociationRequest
     * @return Promise<void>
     */
    public create(request: CreateOrganizationAssociationRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/association`,
            method: 'POST',
            version: '2.0',
            data: request
        });
    }

    /**
     * Update client or provider association activity flag for an organization.
     * Permissions: Admin, Provider, OrgAdmin
     *
     * @param request must implement UpdateOrganizationAssociationRequest
     * @return Promise<void>
     */
    public update(request: UpdateOrganizationAssociationRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/association/${request.account}/${request.organization}`,
            method: 'PATCH',
            version: '2.0',
            data: request
        });
    }

    /**
     * Remove an account association for an organization.
     * Permissions: Admin, Provider, OrgAdmin
     *
     * @param request must implement DeleteOrganizationAssociationRequest
     * @return Promise<void>
     */
    public delete(request: DeleteOrganizationAssociationRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/association/${request.account}/${request.organization}`,
            method: 'DELETE',
            version: '2.0'
        });
    }
}
