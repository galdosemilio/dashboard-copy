/**
 * ingredientType
 */

import * as t from 'io-ts';

export const ingredientType = t.union([t.literal('common'), t.literal('branded')]);
