/**
 * GET /schedule/preferences/:id
 */

import { AccountTypeIds } from '../../account/entities';

export interface SchedulePreferencesSingle {
    /** Organization ID. */
    id: string;
    /**
     * An array of account type IDs (string values) indicating for which accounts the section should be disabled.
     * When it's missing, the section is available to everyone.
     */
    disabledFor?: Array<AccountTypeIds>;
}
