/**
 * Interface for GET /token/login
 */

import * as moment from 'moment';
import { ClientProfileModel } from './clientProfile.model';
import { ManagerProfileModel } from './managerProfile.model';
import { UserMeasurementPreferenceType } from './userMeasurementPreference.type';

export interface Profile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    timezone: string;
    measurementPreference: UserMeasurementPreferenceType;
    createdOn: string;
    lastFetched: moment.Moment | undefined;
    client: ClientProfileModel | ClientProfileModel[];
    provider: any[];
    manager: ManagerProfileModel | ManagerProfileModel[];
}
