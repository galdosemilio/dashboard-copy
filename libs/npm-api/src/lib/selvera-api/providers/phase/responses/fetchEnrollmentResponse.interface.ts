/**
 * Interface for GET /package/enrollment
 */

import * as moment from 'moment';

export interface FetchEnrollmentResponse {
    id: string;
    title: string;
    shortcode: string;
    package: string;
    organization: string;
    startDate: string;
    endDate: string | null;
    account?: {
        id?: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    duration: moment.Duration;
    isActive: boolean;
}
