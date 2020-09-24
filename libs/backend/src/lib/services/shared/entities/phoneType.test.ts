/**
 * phoneType
 */

import * as t from 'io-ts';

export const phoneType = t.union([t.literal('ios'), t.literal('android')]);
