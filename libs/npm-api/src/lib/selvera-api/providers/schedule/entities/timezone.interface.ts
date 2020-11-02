/**
 * Timezone
 */

export interface AccountTimezone {
    account: string;
    timezone: string; // must be a valid postgres name, such as 'America/New_York'
}
