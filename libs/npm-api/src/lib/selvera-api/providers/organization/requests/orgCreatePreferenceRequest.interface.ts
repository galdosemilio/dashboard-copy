/**
 * POST /organization/:id/preference
 */

export interface OrgCreatePreferenceRequest {
    /** The id of the organization. */
    id: string;
    /** Logo filename. */
    logoFileName?: string;
    /** Home screen icon filename, 'logoBaseUrl' used as base url */
    iconFilename?: string;
    /** Splash screen image filename, 'logoBaseUrl' used as base url */
    splashFilename?: string;
    /** Favicon filename, 'logoBaseUrl' used as base url */
    faviconFilename?: string;
    /** Logo baseURL. */
    logoBaseUrl?: string;
    /** Display name. */
    displayName?: string;
    /** Color palette. */
    color?: Partial<{ [color: string]: any }>;
}
