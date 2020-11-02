/**
 * Model for api options
 */

import { Environment } from '../../config/environment.interface';
import { ApiOptions } from './apiOptions.interface';

class ApiOptionsModel implements ApiOptions {
    public readonly baseUrl: string;
    public environment: Environment;
    public readonly endpoint: string;
    public readonly url: string;
    public readonly method: string;
    public readonly version: string;
    public data: Object;
    public params: Object;
    public paramsSerializer: ((params: any) => string) | undefined;
    public responseType?: string;
    public readonly qs: Object;
    public readonly form: Object;
    public readonly validateStatus: (status: number) => boolean;
    public headers: { [s: string]: string };
    public readonly withCredentials: boolean | undefined = true;

    /**
     * @param apiOptions {}
     * @returns void
     */
    public constructor(apiOptions: ApiOptions) {
        this.environment = apiOptions.environment || 'test';
        this.version = apiOptions.version || '1.0';
        this.endpoint = apiOptions.endpoint || '/';
        this.url = `${apiOptions.baseUrl}${this.version}${this.endpoint}`;
        this.method = apiOptions.method || 'GET';
        this.data = apiOptions.data || {};
        this.params = apiOptions.params || {};
        this.paramsSerializer = apiOptions.paramsSerializer;
        this.headers = apiOptions.headers || {};
        this.withCredentials = apiOptions.withCredentials || true;
        this.validateStatus = function(status: number): boolean {
            return status >= 200;
        };
        this.responseType = apiOptions.responseType || undefined;
    }
}

export { ApiOptionsModel };
