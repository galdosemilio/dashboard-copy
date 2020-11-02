/**
 * PATCH /organization/:id/preference/admin
 */

import { OrganizationMala } from '../entities';

export interface OrgUpdateAdminPreferenceRequest {
    /** The id of the organization. */
    id: string;
    /** Reset password baseUrl */
    resetPasswordBaseUrl?: string;
    mala?: OrganizationMala;
}
