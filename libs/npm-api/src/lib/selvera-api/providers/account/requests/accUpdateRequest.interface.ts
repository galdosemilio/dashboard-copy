/**
 * Interface for POST /account
 */

import {
    AccountMeasurementPreferenceType,
    AccountTitleId,
    ClientData,
    PhoneType
} from '../entities';

export interface AccUpdateRequest {
    id: string;
    title?: AccountTitleId;
    firstName?: string;
    lastName?: string;
    email?: string;
    measurementPreference?: AccountMeasurementPreferenceType;
    phone?: string;
    countryCode?: string;
    phoneType?: PhoneType;
    timezone?: string;
    preferredLocales?: Array<string>;
    client?: Partial<ClientData>;
}
