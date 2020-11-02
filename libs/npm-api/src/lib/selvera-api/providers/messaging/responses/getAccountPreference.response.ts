/**
 * GET /message/preference/account
 */

export interface GetAccountPreferenceResponse {
    /** Preference id. */
    id: string;
    /** Account placeholder */
    account: {
        /** Account id */
        id: string;
    };
    /** Organization placeholder */
    organization: {
        /** Organization id */
        id: string;
    };
    /** Flag enabling email notification */
    sendEmail: boolean;
    /** Flag showing if push notification is enabled */
    sendPushNotification: boolean;
}
