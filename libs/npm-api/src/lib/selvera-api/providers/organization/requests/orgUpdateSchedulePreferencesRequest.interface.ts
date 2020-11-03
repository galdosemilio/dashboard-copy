/**
 * Interface for PUT /schedule/preferences/:organization
 */

import { AccountTypeIds } from '../../account/entities';

export interface OrgUpdateSchedulePreferencesRequest {
    organization: string;
    disabledFor: Array<AccountTypeIds>;
}
