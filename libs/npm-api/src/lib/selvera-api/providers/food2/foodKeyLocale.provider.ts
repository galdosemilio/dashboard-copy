import { ApiService } from '../../services/api.service';

import {
    DeleteFoodKeyLocaleRequest,
    GetFoodKeyLocaleRequest,
    UpdateFoodKeyLocaleRequest
} from './requests';
import { GetFoodKeyLocaleResponse } from './responses';

export class FoodKeyLocale {
    public constructor(private readonly apiService: ApiService) {}

    /**
     * Get a translation for specific key & locale.
     * Permissions: Admin
     *
     * @param request must implement GetFoodKeyLocaleRequest
     * @return Promise<GetFoodKeyLocaleResponse>
     */
    public get(
        request: GetFoodKeyLocaleRequest
    ): Promise<GetFoodKeyLocaleResponse> {
        return this.apiService.request({
            endpoint: `/food/key/${request.id}/locale/${request.locale}`,
            method: 'GET',
            version: '1.0'
        });
    }

    /**
     * Create a translation for specific key & locale.
     * Permissions: Admin
     *
     * @param request must implement UpdateFoodKeyLocaleRequest
     * @return Promise<void>
     */
    public update(request: UpdateFoodKeyLocaleRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/food/key/${request.id}/locale/${request.locale}`,
            method: 'PUT',
            version: '1.0',
            data: request
        });
    }

    /**
     * Deletes a translation for specific key & locale.
     * Permissions: Admin
     *
     * @param request must implement DeleteFoodKeyLocaleRequest
     * @return Promise<void>
     */
    public delete(request: DeleteFoodKeyLocaleRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/food/key/${request.id}/locale/${request.locale}`,
            method: 'DELETE',
            version: '1.0'
        });
    }
}
