import { MatPaginator, MatSort } from '@coachcare/common/material';

/**
 * Data Utilities
 */

export function getterPaginator(paginator: MatPaginator, limit = 10) {
  return () => ({
    offset:
      paginator && paginator.pageSize
        ? paginator.pageIndex * paginator.pageSize
        : 0,
    limit: paginator ? paginator.pageSize : limit,
  });
}

export function getterSorter(sorter: MatSort) {
  return () => {
    return sorter && sorter.active
      ? {
          sort: [{ property: sorter.active, dir: sorter.direction }],
        }
      : {};
  };
}
