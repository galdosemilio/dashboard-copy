/**
 * GET /available
 */

import * as t from 'io-ts';
import { scheduleAvailableItem } from '../../../shared/index.test';

export const getAllScheduleAvailableResponse = t.array(scheduleAvailableItem);
