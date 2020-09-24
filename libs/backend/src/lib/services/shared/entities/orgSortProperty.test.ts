/**
 * orgSortProperty
 */

import * as t from 'io-ts';

export const orgSortProperty = t.union([t.literal('createdAt'), t.literal('name')]);
