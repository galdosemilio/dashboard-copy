/**
 * Interface for PATCH /organization/preference/email/:id
 */

export interface UpdateEmailTemplateRequest {
    id: string;
    category?: 'client' | 'other';
    locale?: string;
    subject?: string;
    html?: string;
    text?: string;
}
