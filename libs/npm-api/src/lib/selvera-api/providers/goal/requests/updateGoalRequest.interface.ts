/**
 * Interface for PUT /goal
 */

import { GoalObject } from './goalObjectRequest.interface';

export interface UpdateGoalRequest {
    account?: string;
    goal: Array<GoalObject>;
}
