/**
 * GET /measurement/body
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetAllMeasurementBodyResponse } from './getAllMeasurementBody.response';

export const getAllMeasurementBodyResponse = createTest<GetAllMeasurementBodyResponse>(
  'GetAllMeasurementBodyResponse',
  {
    /**
     * Array of data objects. There will be one entry for COLUMN for each element passed in via the data array.
     * Results are given in ascending order by date.
     */
    data: t.array(
      createValidator({
        /** ID of measurement record. */
        id: t.number,
        /** The starting date of the measurement record as an ISO date string. */
        date: t.string,
        /** The value for COLUMN. */
        COLUMN: t.number
      })
    ),
    /**
     * Summary Object for the result set.
     * There will be a triplet of entries (COLUMNMin, COLUMNMax, COLUMNAverage) for each COLUMN passed in via the data column.
     */
    summary: createValidator({
      /** The timestamp of the client's oldest weigh in or an empty string if not applicable. */
      oldestRecord: t.string,
      /** The weight measurement at the client's oldest weigh in (or 0 if not given) */
      oldestWeight: t.number,
      /** Weight at the last measurement (or 0 if not given) */
      previousWeight: t.number,
      /** BMI at the last measurement (or 0 if not given) */
      previousBMI: t.number,
      /** Body fat at the last measurement (or 0 if not given) */
      previousBodyFat: t.number,
      /** The minimum value for COLUMN in the result set. */
      COLUMNMin: t.number,
      /** The maximum value for COLUMN in the result set. */
      COLUMNMax: t.number,
      /** The average value for COLUMN in the result set. */
      COLUMNAverage: t.number
    })
  }
);
