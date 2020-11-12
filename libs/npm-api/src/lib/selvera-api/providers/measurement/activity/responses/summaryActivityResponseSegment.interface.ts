/**
 * Interface for single day|week|month of data for activity summary section
 */

export interface SummaryActivityResponseSegment {
  date: string
  caloriesAverage?: number
  caloriesTotal?: number
  distanceAverage?: number
  distanceTotal?: number
  stepAverage?: number
  stepTotal?: number
}
