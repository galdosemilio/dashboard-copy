export interface EmailTemplate {
    category: 'client' | 'other';
    html?: string;
    id: string;
    locale: string;
    operation:
        | 'password-reset'
        | 'new-account'
        | 'internal-registration'
        | 'token-expiration';
    subject?: string;
    text?: string;
}
