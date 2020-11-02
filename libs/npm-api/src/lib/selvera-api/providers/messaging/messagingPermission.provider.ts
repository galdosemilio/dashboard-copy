import { ApiService } from '../../services/api.service';

import {
    CreateMessagingPermissionRequest,
    DeleteMessagingPermissionRequest,
    GetSingleMessagingPermissionRequest
} from './requests';

export class MessagingPermission {
    public constructor(private readonly apiService: ApiService) {}

    /**
     * Check if user has permission to a thread.
     * Permissions: Provider, Client
     *
     * @param request must implement GetSingleMessagingPermissionRequest
     * @return Promise<void>
     */
    public getSingle(request: GetSingleMessagingPermissionRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/message/permission`,
            method: 'GET',
            version: '2.0',
            data: request
        });
    }

    /**
     * Add permission to a user to have access to a thread.
     * Permissions: Provider, Client
     *
     * @param request must implement CreateMessagingPermissionRequest
     * @return Promise<void>
     */
    public create(request: CreateMessagingPermissionRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/message/permission`,
            method: 'POST',
            version: '2.0',
            data: request
        });
    }

    /**
     * Remove permission for a user to no longer have access to a thread.
     * Permissions: Provider, Client
     *
     * @param request must implement DeleteMessagingPermissionRequest
     * @return Promise<void>
     */
    public delete(request: DeleteMessagingPermissionRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/message/permission/${request.threadId}/${request.account}`,
            method: 'DELETE',
            version: '2.0'
        });
    }
}
