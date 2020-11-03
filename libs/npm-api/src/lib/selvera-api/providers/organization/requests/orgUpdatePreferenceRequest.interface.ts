/**
 * PATCH /organization/:id/preference
 */

export interface OrgUpdatePreferenceRequest {
    /** The id of the organization. */
    id: string;
    /** Logo filename. Can be null to remove the value. */
    logoFileName?: string;
    /** Home screen icon filename, 'logoBaseUrl' used as base url */
    iconFilename?: string;
    /** Splash screen image filename, 'logoBaseUrl' used as base url */
    splashFilename?: string;
    /** Favicon filename, 'logoBaseUrl' used as base url */
    faviconFilename?: string;
    /** Logo base url. Can be null to remove the value. */
    logoBaseUrl?: string;
    /** Display name. Can be null to remove the value. */
    displayName?: string;
    /** Color palette. */
    color?: Partial<{ [color: string]: any }>;
}
