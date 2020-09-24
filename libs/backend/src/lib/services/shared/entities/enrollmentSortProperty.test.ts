/**
 * enrollmentSortProperty
 */

import * as t from 'io-ts';

export const enrollmentSortProperty = t.union([t.literal('enrollStart'), t.literal('enrollEnd')]);
