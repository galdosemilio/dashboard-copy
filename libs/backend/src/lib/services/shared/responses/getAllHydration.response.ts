/**
 * GET /hydration
 */

import { Pagination } from '../generic';

export interface GetAllHydrationResponse {
  hydration: {
    [date: string]: {
      quantity: number;
    };
  };
  pagination: Partial<Pagination>;
}
