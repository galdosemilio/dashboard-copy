/**
 * Client Device Types
 */

import * as t from 'io-ts';

export const deviceTypeId = t.union([t.literal('1'), t.literal('2'), t.literal('3')]);
