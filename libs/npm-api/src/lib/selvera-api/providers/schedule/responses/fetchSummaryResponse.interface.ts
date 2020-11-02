/**
 * Interface for GET /schedule/summary (response)
 */

export interface FetchSummaryResponse {
    '1on1initialMinutes': number;
    '1on1initialSessions': number;
    '1on1Minutes': number;
    '1on1Sessions': number;
    circleMinutes: number;
    circleSessions: number;
}
