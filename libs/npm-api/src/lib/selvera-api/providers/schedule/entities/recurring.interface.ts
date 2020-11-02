/**
 * Recurring
 */

export interface MeetingRecurringRequest {
    interval: string;
    endDate: string;
}

export interface MeetingRecurringResponse {
    /** A flag indicating whether a single meeting from the recurring series was edited */
    edited: boolean;
    /** @deprecated use 'template.id' instead */
    recurringTemplateId: string;
    /** Recurring template data */
    template: {
        /** Recurring template ID */
        id: string;
    };
}
