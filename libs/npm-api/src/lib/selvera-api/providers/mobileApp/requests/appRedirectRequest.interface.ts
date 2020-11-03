/**
 * Interface for GET /app/:platform/:organization (request)
 */

export interface AppRedirectRequest {
    platform: 'ios' | 'android';
    organization: string;
}
