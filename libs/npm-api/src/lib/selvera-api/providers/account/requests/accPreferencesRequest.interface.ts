/**
 * Interface for POST /account/:account/preference
 */

import { AccountPreferences } from '../entities';

export interface AccPreferencesRequest extends AccountPreferences {
    account: string;
}
