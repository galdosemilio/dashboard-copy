/**
 * Interface for GET /hydration/summary (Response)
 */

export interface HydrationSummaryResponse {
    date: string;
    total: number;
    max: number;
    average: number;
}
