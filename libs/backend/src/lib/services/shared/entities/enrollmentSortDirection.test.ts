/**
 * enrollmentSortDirection
 */

import * as t from 'io-ts';

export const enrollmentSortDirection = t.union([t.literal('asc'), t.literal('desc')]);
