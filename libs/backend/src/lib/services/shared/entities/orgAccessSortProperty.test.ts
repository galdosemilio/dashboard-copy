/**
 * orgAccessSortProperty
 */

import * as t from 'io-ts';

export const orgAccessSortProperty = t.union([t.literal('name'), t.literal('state')]);
