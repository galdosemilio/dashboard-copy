/**
 * Interface for /organization/:id/preference
 */

import { AppIds, OrganizationAssets } from '../entities';

export interface OrgAssetsResponse {
    /** ID of an organization the assets belongs to */
    id: string;
    /** Display name of the organization */
    displayName?: string;
    /** Organization assets */
    assets: OrganizationAssets;
    /** App ID mapping. */
    appIds: AppIds;
    /** MALA settings */
    mala?: any;
}
