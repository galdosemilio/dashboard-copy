/**
 * Pagination and Sort
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { Pagination, Sort } from './pg';

// pagination
export const pagination = createValidator<Pagination>({
  next: optional(t.number),
  prev: optional(t.number)
});

export function listResponse<T, V extends t.Type<T>>(type: t.ExactType<V>) {
  return {
    data: t.array(type)
  };
}

export function pagedResponse<T, V extends t.Type<T>>(type: t.ExactType<V>) {
  return {
    data: t.array(type),
    pagination: pagination
  };
}

// sort
export const sortDirection = t.union([t.literal('asc'), t.literal('desc')]);

export function sort<T>(prop: t.Type<T>) {
  return createValidator<Sort<T>>({
    property: prop,
    dir: sortDirection
  });
}
