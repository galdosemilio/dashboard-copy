/**
 * painTypeId
 */

import * as t from 'io-ts';

export const painTypeId = t.union([t.literal(1), t.literal(2), t.literal(3), t.literal(4)]);
