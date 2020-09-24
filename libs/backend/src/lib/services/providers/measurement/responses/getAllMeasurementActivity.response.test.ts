/**
 * GET /measurement/activity
 */

import * as t from 'io-ts';
import { activitySegment } from '../../../shared/index.test';

export const getAllMeasurementActivityResponse = t.array(activitySegment);
