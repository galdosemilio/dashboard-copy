import {
    AddHydrationRequest,
    DeleteHydrationRequest,
    GetHydrationRequest,
    GetHydrationSummaryRequest,
    UpdateHydrationRequest
} from '../../providers/hydration/requests';
import { HydrationResponse, HydrationSummaryResponse } from '../../providers/hydration/responses';
import { ApiService } from '../../services/api.service';

/**
 * Hydration posting/fetching/updating
 */
class Hydration {
    /**
     * Init Api Service
     */
    public constructor(private readonly apiService: ApiService) {}

    /**
     * Add Hydration
     * @param addHydrationRequest must implement AddHydrationRequest
     * @returns void
     */
    public add(addHydrationRequest: AddHydrationRequest): Promise<void> {
        return this.apiService.request({
            endpoint: '/hydration',
            method: 'POST',
            data: addHydrationRequest
        });
    }

    /**
     * Get Hydration
     * @param getHydrationRequest must implement GetHydrationRequest
     * @returns getHydrationResponse
     */
    public fetch(getHydrationRequest?: GetHydrationRequest): Promise<HydrationResponse> {
        return this.apiService.request({
            endpoint: '/hydration',
            method: 'GET',
            data: getHydrationRequest
        });
    }

    /**
     * Get Hydration Summary
     * @param getHydrationSummaryRequest must implement GetHydrationSummaryRequest
     * @returns Array<HydrationSummaryResponse>
     */
    public fetchSummary(
        getHydrationSummaryRequest: GetHydrationSummaryRequest
    ): Promise<Array<HydrationSummaryResponse>> {
        return this.apiService.request({
            endpoint: '/hydration/summary',
            method: 'GET',
            data: getHydrationSummaryRequest
        });
    }

    /**
     * Update Hydration
     * @param updateHydrationRequest must implement UpdateHydrationRequest
     * @returns void
     */
    public update(updateHydrationRequest: UpdateHydrationRequest): Promise<void> {
        return this.apiService.request({
            endpoint: '/hydration',
            method: 'PUT',
            data: updateHydrationRequest
        });
    }

    /**
     * Delete Hydration
     * @param deleteHydrationRequest must implement DeleteHydrationRequest
     * @returns void
     */
    public delete(deleteHydrationRequest: DeleteHydrationRequest): Promise<void> {
        return this.apiService.request({
            endpoint: '/hydration',
            method: 'DELETE',
            data: deleteHydrationRequest
        });
    }
}

export { Hydration };
