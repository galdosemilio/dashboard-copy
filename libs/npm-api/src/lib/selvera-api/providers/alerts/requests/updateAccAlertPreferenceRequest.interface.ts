/**
 * Interface for PUT /warehouse/alert/preference/:id/account
 */

import { AlertOrgPreference } from '../entities';

export interface UpdateAccAlertPreferenceRequest {
    id: string | number;
    account: string;
    preference: AlertOrgPreference;
}
