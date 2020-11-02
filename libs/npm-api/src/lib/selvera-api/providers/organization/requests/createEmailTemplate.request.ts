/**
 * Interface for POST /organization/preference/email
 */

export interface CreateEmailTemplateRequest {
    organization: string;
    operation:
        | 'password-reset'
        | 'new-account'
        | 'internal-registration'
        | 'token-expiration';
    category?: 'client' | 'other';
    locale?: string;
    subject?: string;
    html?: string;
    text?: string;
}
