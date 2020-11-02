/**
 * Interface Client Profile Model
 */

import { UserMeasurementPreferenceType } from './userMeasurementPreference.type';

export interface ClientProfileModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    timezone: string;
    measurementPreference: UserMeasurementPreferenceType;
    createdOn: string;
    birthday: string;
    phone: string;
    height: string;
    gender: string;
    status: string;
    goalWeight: string;
}
