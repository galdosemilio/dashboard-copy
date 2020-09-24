/**
 * Alerts
 */

import * as t from 'io-ts';

export const alertCategory = t.union([t.number, t.literal('none')]);
