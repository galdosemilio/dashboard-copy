/**
 * Interface for PATCH /sequence/preference/organization/:id
 */

export interface UpdateSeqOrgPreferenceRequest {
    /** Preference entry ID */
    id: string;
    /** A flag indicating if the entry is active */
    isActive?: boolean;
}
