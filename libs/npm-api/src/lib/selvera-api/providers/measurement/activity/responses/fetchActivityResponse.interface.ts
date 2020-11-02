/**
 * Interface for GET /measurement/activity (response)
 */

export interface FetchActivityResponse {
    id: number;
    userId: number;
    recordedAt: string;
    activityDate: string;
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
