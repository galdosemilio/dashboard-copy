/**
 * Location
 */

export interface MeetingLocation {
    streetAddress: string;
    city: string;
    postalCode: string;
    state: string;
    country: string;
}

export type MeetingLocationRequest = MeetingLocation & {
    latitude?: string;
    longitude?: string;
};

export type MeetingLocationResponse = MeetingLocation & {
    /** Coordinates for the location of the meeting */
    coordinates?: {
        /** Coordinates latitude */
        latitude: string;
        /** Coordinates longitude */
        longitude: string;
    };
};
