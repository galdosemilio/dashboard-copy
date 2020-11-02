import { ApiService } from '../../services/api.service';
import { FetchSingleStatusReponse } from './responses';

/**
 * MALA provider
 */
export class MALA {
    /**
     * Init Api Service
     */
    public constructor(private readonly apiService: ApiService) {}

    /**
     * Returns statuses for last builds of apps for requested organization
     * @param organization ID of organization to fetch data for
     * @returns
     */
    public fetchSingleStatus(
        organization: string
    ): Promise<FetchSingleStatusReponse> {
        return this.apiService.request({
            endpoint: `/build/status/${organization}`,
            method: `GET`,
            version: '1.0'
        });
    }
}
