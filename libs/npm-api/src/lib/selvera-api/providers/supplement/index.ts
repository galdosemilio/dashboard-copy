import {
    AddConsumptionRequest,
    AddSupplementAccountAssociationRequest,
    AddSupplementAssociationRequest,
    AddSupplementRequest,
    FetchAllConsumptionRequest,
    FetchSupplementAccountAssociationRequest,
    FetchSupplementSummaryRequest,
    SearchSupplementsRequest,
    UpdateConsumptionRequest,
    UpdateSupplementAccountAssociationRequest,
    UpdateSupplementAssociationRequest,
    UpdateSupplementRequest
} from '../../providers/supplement/requests';
import {
    AddConsumptionResponse,
    AddSupplementAccountAssociationResponse,
    AddSupplementAssociationResponse,
    AddSupplementResponse,
    FetchAllConsumptionResponse,
    FetchSupplementAccountAssociationResponse,
    FetchSupplementAssociationResponse,
    FetchSupplementsResponse,
    FetchSupplementSummaryResponse,
    SearchSupplementsResponse
} from '../../providers/supplement/responses';
import { ApiService } from '../../services/index';
import { PageOffset, PageSize } from '../content/entities/index';

/**
 * Supplement summary/posting/fetching/updating/deleting
 */
class Supplement {
    public constructor(private readonly apiService: ApiService) {}

    /**
     * Get supplement summary
     * @param fetchSupplementSummaryRequest must implement FetchSupplementSummaryRequest
     * @returns FetchSupplementSummaryResponse
     */
    public fetchSummary(
        fetchSupplementSummaryRequest: FetchSupplementSummaryRequest
    ): Promise<FetchSupplementSummaryResponse> {
        return this.apiService.request({
            endpoint: '/supplement/summary',
            method: 'GET',
            data: fetchSupplementSummaryRequest,
            version: '2.0'
        });
    }

    /**
     * Create new supplement
     * @param addSupplementRequest must implement AddSupplementRequest
     * @returns AddSupplementResponse
     */
    public add(addSupplementRequest: AddSupplementRequest): Promise<AddSupplementResponse> {
        return this.apiService.request({
            endpoint: '/supplement',
            method: 'POST',
            data: addSupplementRequest,
            version: '2.0'
        });
    }

    /**
     * Search supplements by full or short name, both active and inactive
     * @param searchSupplementsRequest must implement SearchSupplementsRequest
     * @returns SearchSupplementsResponse
     */
    public search(searchSupplementsRequest: SearchSupplementsRequest): Promise<SearchSupplementsResponse> {
        return this.apiService.request({
            endpoint: '/supplement',
            method: 'GET',
            data: searchSupplementsRequest,
            version: '2.0'
        });
    }

    /**
     * Update existing supplement
     * @param updateSupplementRequest must implement UpdateSupplementRequest
     * @returns void
     */
    public update(updateSupplementRequest: UpdateSupplementRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/supplement/${updateSupplementRequest.id}`,
            method: 'PUT',
            data: updateSupplementRequest,
            version: '2.0'
        });
    }

    /**
     * Add supplement record for date.
     * If an entry already exists for specified date/account/supplement combination,
     * it will be overwritten with this request
     * @param addConsumptionRequest must implement AddConsumptionRequest
     * @returns AddConsumptionResponse
     */
    public addConsumption(addConsumptionRequest: AddConsumptionRequest): Promise<AddConsumptionResponse> {
        return this.apiService.request({
            endpoint: '/supplement/consumption',
            method: 'POST',
            data: addConsumptionRequest,
            version: '2.0'
        });
    }

    /**
     * Get supplement intake, returns a maximum of 10 matching entries, ordered by supplement start date
     * @param fetchConsumptionRequest must implement FetchAllConsumptionRequest
     * @returns FetchAllConsumptionResponse
     */
    public fetchAllConsumption(
        fetchAllConsumptionRequest: FetchAllConsumptionRequest
    ): Promise<FetchAllConsumptionResponse> {
        return this.apiService.request({
            endpoint: '/supplement/consumption',
            method: 'GET',
            data: fetchAllConsumptionRequest,
            version: '2.0'
        });
    }

    /**
     * Update supplement for date specified. Will add missing entries,
     * update existing supplement entries and remove entries that are not in the collection
     * @param updateAccountAssociationRequest must implement UpdateConsumptionRequest
     * @returns void
     */
    public updateConsumption(updateConsumptionRequest: UpdateConsumptionRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/supplement/consumption/${updateConsumptionRequest.id}`,
            method: 'PUT',
            data: updateConsumptionRequest,
            version: '2.0'
        });
    }

    /**
     * Delete specific supplement entry for a specific date
     * @param id ID of the consumption entry to delete
     * @returns void
     */
    public deleteConsumption(id: string): Promise<void> {
        return this.apiService.request({
            endpoint: `/supplement/consumption/${id}`,
            method: 'DELETE',
            version: '2.0'
        });
    }

    /**
     * Associate supplement with organization
     * @param addAssociationRequest must implement AddSupplementAssociationRequest
     * @returns AddSupplementAssociationResponse
     */
    public addAssociation(
        addAssociationRequest: AddSupplementAssociationRequest
    ): Promise<AddSupplementAssociationResponse> {
        return this.apiService.request({
            endpoint: '/supplement/organization',
            method: 'POST',
            data: addAssociationRequest,
            version: '2.0'
        });
    }

    /**
     * Fetch supplements by organization, along with their association IDs
     * @param organization organization ID
     * @returns FetchSupplementAssociationResponse
     */
    public fetchSupplementsFor(
        organization: string,
        limit?: PageSize,
        offset?: PageOffset
    ): Promise<FetchSupplementsResponse> {
        return this.apiService.request({
            endpoint: '/supplement/organization',
            method: 'GET',
            data: { organization, limit, offset },
            version: '3.0'
        });
    }

    /**
     * Fetch supplement-organization association by ID
     * @param id ID of the supplement-organization association
     * @returns FetchSupplementAssociationResponse
     */
    public fetchAssociation(id: string): Promise<FetchSupplementAssociationResponse> {
        return this.apiService.request({
            endpoint: `/supplement/organization/${id}`,
            method: 'GET',
            version: '2.0'
        });
    }

    /**
     * Update dosage on supplement-organization association
     * @param updateAssociationRequest must implement UpdateSupplementAssociationRequest
     * @returns void
     */
    public updateAssociation(updateAssociationRequest: UpdateSupplementAssociationRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/supplement/organization/${updateAssociationRequest.id}`,
            method: 'PUT',
            data: updateAssociationRequest,
            version: '2.0'
        });
    }

    /**
     * Delete supplement-organization entry by specified ID
     * @param id string ID of the supplement-organization association
     * @returns void
     */
    public deleteAssociation(id: string): Promise<void> {
        return this.apiService.request({
            endpoint: `/supplement/organization/${id}`,
            method: 'DELETE',
            version: '2.0'
        });
    }

    /**
     * Create association between supplement organization and client account
     * @param addAccountAssociationRequest must implement AddSupplementAccountAssociationRequest
     * @returns AddSupplementAccountAssociationResponse
     */
    public addAccountAssociation(
        addAccountAssociationRequest: AddSupplementAccountAssociationRequest
    ): Promise<AddSupplementAccountAssociationResponse> {
        return this.apiService.request({
            endpoint: '/supplement/account/organization/',
            method: 'POST',
            data: addAccountAssociationRequest,
            version: '2.0'
        });
    }

    /**
     * Get association between supplement, organization and client account
     * @param fetchAccountAssociationRequest must implement FetchSupplementAccountAssociationRequest
     * @returns FetchSupplementAccountAssociationResponse
     */
    public fetchAccountAssociation(
        fetchAccountAssociationRequest: FetchSupplementAccountAssociationRequest
    ): Promise<FetchSupplementAccountAssociationResponse> {
        return this.apiService.request({
            endpoint: '/supplement/account/organization/',
            method: 'GET',
            data: fetchAccountAssociationRequest,
            version: '2.0'
        });
    }

    /**
     * Update dosage in association between supplement organization and client account
     * @param updateAccountAssociationRequest must implement UpdateSupplementAccountAssociationRequest
     * @returns void
     */
    public updateAccountAssociation(
        updateAccountAssociationRequest: UpdateSupplementAccountAssociationRequest
    ): Promise<void> {
        return this.apiService.request({
            endpoint: `/supplement/account/organization/${updateAccountAssociationRequest.id}`,
            method: 'PUT',
            data: updateAccountAssociationRequest,
            version: '2.0'
        });
    }

    /**
     * Delete association between supplement organization and client account
     * @param id Supplement-organization-account entry ID
     * @returns void
     */
    public deleteAccountAssociation(id: string): Promise<void> {
        return this.apiService.request({
            endpoint: `/supplement/account/organization/${id}`,
            method: 'DELETE',
            version: '2.0'
        });
    }
}

export { Supplement };
