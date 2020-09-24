/**
 * gender
 */

import * as t from 'io-ts';

export const gender = t.union([t.literal('male'), t.literal('female')]);
