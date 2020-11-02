/**
 * Interface for POST /account
 */

import { AllOrgPermissions } from '../../organization/entities';
import {
    AccountMeasurementPreferenceType,
    AccountTitleId,
    ClientData,
    PhoneType
} from '../entities';

export interface AccAddRequest {
    title?: AccountTitleId;
    firstName: string;
    lastName: string;
    email: string;
    accountType: string;
    association?: {
        organization: string;
        permissions?: Partial<AllOrgPermissions>;
    };
    phone: string;
    phoneType?: PhoneType;
    countryCode?: string;
    measurementPreference?: AccountMeasurementPreferenceType;
    timezone?: string;
    preferredLocales?: Array<string>;
    client?: Partial<ClientData>;
}
