/**
 * GET /measurement/body
 */

export interface GetAllMeasurementBodyResponse {
  /**
   * Array of data objects. There will be one entry for COLUMN for each element passed in via the data array.
   * Results are given in ascending order by date.
   */
  data: Array<{
    /** ID of measurement record. */
    id: number;
    /** The starting date of the measurement record as an ISO date string. */
    date: string;
    /** The value for COLUMN. */
    COLUMN: number;
  }>;
  /**
   * Summary Object for the result set.
   * There will be a triplet of entries (COLUMNMin, COLUMNMax, COLUMNAverage) for each COLUMN passed in via the data column.
   */
  summary: {
    /** The timestamp of the client's oldest weigh in or an empty string if not applicable. */
    oldestRecord: string;
    /** The weight measurement at the client's oldest weigh in (or 0 if not given) */
    oldestWeight: number;
    /** Weight at the last measurement (or 0 if not given) */
    previousWeight: number;
    /** BMI at the last measurement (or 0 if not given) */
    previousBMI: number;
    /** Body fat at the last measurement (or 0 if not given) */
    previousBodyFat: number;
    /** The minimum value for COLUMN in the result set. */
    COLUMNMin: number;
    /** The maximum value for COLUMN in the result set. */
    COLUMNMax: number;
    /** The average value for COLUMN in the result set. */
    COLUMNAverage: number;
  };
}
