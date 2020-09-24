/**
 * activeStatus
 */

import * as t from 'io-ts';

export const activeStatus = t.union([t.literal('all'), t.literal('active'), t.literal('inactive')]);
