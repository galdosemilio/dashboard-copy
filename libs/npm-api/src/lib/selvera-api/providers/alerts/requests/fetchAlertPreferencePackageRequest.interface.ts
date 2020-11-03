/**
 * Interface for GET /warehouse/alert/preference/package
 */

export interface FetchAlertPreferencePackageRequest {
    /** Alert preference ID */
    preference: string;
    /** Package ID */
    package?: string;
    /** Page size. Can either be "all" (a string) or a number */
    limit?: number | 'all';
    /** Page offset */
    offset?: number;
}
