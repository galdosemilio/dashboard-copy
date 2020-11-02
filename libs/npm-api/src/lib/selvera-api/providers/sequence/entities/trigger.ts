export interface TriggerEntity {
    /** Content text. Required for Email, Push Notification and SMS */
    content: string;
    /** Header text. Required for Email. */
    header: string;
    /** Trigger message */
    message: string;
    /** Subject text. Required for Email. */
    subject: string;
    /** Title text. Required for Push Notification. */
    title: string;
    /** Trigger type ID */
    type: string;
}

export type TypelessTriggerEntity = Pick<
    TriggerEntity,
    'content' | 'header' | 'subject' | 'title' | 'message'
>;
