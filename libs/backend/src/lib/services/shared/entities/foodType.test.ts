/**
 * foodType
 */

import * as t from 'io-ts';

export const foodType = t.union([t.literal('branded'), t.literal('common')]);
