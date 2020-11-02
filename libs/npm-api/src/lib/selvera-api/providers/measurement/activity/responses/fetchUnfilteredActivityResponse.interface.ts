/**
 * Interface for unfiltered GET /measurement/activity (response)
 */

export interface FetchUnfilteredActivityResponse {
    id: number;
    user_id: number;
    recorded_at: string;
    activity_date: string;
    timezone: string;
    steps: number;
    distance: number;
    calories: number;
    elevation: number;
    soft: number;
    moderate: number;
    intense: number;
    source: number;
}
