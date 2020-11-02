/**
 * POST /client/register
 */

export interface ClientRegisterRequest {
    /** Organization Id. */
    organization: string;
    /** Account title ID. */
    title?: string;
    /** First name. */
    firstName: string;
    /** Last name. */
    lastName: string;
    /** Email address. */
    email: string;
    /** The password for the user. */
    password: string;
    /** Phone number. */
    phone: string;
    /**
     * The device type of the logging-in user - must match a value in the device_type table.
     * If either iOS or Android, user token will be returned and no cookie will be set.
     * If Web, no token will be returned but a cookie will be set.
     */
    deviceType: string;
    /** Phone type. */
    phoneType?: string;
    /** Measurement preference. */
    measurementPreference?: 'us' | 'uk' | 'metric';
    /** Account timezone. */
    timezone?: string;
    /** List of preferred languages/locales. Should be provided in an appropriate order. */
    preferredLocales?: Array<string>;
    /** Client profile data. */
    client: {
        /** Date of birth. */
        birthday: string;
        /** Height in centimeters. */
        height: number;
        /** Client gender. */
        gender: 'male' | 'female';
        /** The BMR number. */
        bmr?: number;
    };
    /** Healthy badge station. */
    healthyBadgeStation?: string;
    /** Calendar view. */
    calendarView?: 'list' | 'calendar:month' | 'calendar:day';
}
