/**
 * Interface for GoalObject
 */

export interface GoalObject {
  goal:
    | 'calorie'
    | 'dailyHydration'
    | 'dailySleep'
    | 'dailyStep'
    | 'weeklyExercise'
    | 'weight'
    | 'triggerWeight'
  quantity: number
}
