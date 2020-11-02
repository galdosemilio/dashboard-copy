/**
 * Interface for GET /food/consumed
 */

export interface CalorieRequest {
    filter?: string;
    account?: number;
    type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    offset?: number;
    startDate?: string;
    endDate?: string;
    noLimit?: boolean;
}
