/**
 * Interface for GET /goal (Response)
 */

export interface FetchGoalResponse {
  goal: {
    weight: number
    dailyHydration: number
    weeklyExercise: number
    dailySleep: number
    dailyStep: number
    triggerWeight: number
  }
}
