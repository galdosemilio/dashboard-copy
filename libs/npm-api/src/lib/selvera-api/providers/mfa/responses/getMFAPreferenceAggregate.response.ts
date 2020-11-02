import { Section } from '../entities';

/**
 * Interface for /mfa/preference/aggregate
 */

export interface GetMFAPreferenceAggregateResponse {
    /** Available sections for a specific organization */
    data: Section[];
}
