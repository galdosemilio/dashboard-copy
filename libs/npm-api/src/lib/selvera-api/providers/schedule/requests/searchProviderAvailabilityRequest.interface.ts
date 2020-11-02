/**
 * Interface for GET /available/match
 */

export interface SearchProviderAvailabilityRequest {
    providers: Array<string>;
    preferredTime: 'morning' | 'afternoon' | 'evening';
    offset: number; // -12 through 14
}
