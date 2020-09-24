/**
 * contentSortProperty
 */

import * as t from 'io-ts';

export const contentSortProperty = t.union([t.literal('name'), t.literal('createdAt')]);
