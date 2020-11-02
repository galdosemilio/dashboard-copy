/**
 * Interface for /organization/:id/preference
 */

import {
    AppIds,
    ClinicCodeHelp,
    OrganizationAssets,
    OrganizationFoodMode,
    OrganizationScheduling
} from '../entities';

export interface OrgPreferencesResponse {
    /** ID of an organization the preference entry belongs to */
    id?: string;
    /** Display name of the organization */
    displayName?: string;
    /** Organization assets */
    assets?: OrganizationAssets;
    /** Enabled food-tracking modes */
    food: {
        /** Enabled mode collection. Will be empty if no explicit preference is set for the hierarchy. */
        mode: Array<OrganizationFoodMode>;
    };
    /** Scheduling settings object. Will be missing if no explicit preference is set for the hierarchy. */
    scheduling?: OrganizationScheduling;
    /** Conference preference object. Will be missing if no explicit preference is set for the hierarchy. */
    conference?: {
        /** Whether the content service is enabled or not */
        enabled: boolean;
    };
    /** Digital library preference object.  Will be missing if no explicit preference is set for the hierarchy. */
    content?: {
        /** Whether the content service is enabled or not */
        enabled: boolean;
    };
    /** App ID mapping. */
    appIds: AppIds;
    /** MALA settings */
    mala?: any;
    /** Array of helper texts for organization */
    clinicCodeHelp?: ClinicCodeHelp[];
}
