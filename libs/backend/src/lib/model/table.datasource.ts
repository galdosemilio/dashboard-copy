import { AppDataSource } from './generic.datasource';

export abstract class TableDataSource<T, R, C> extends AppDataSource<T, R, C> {
  /**
   * Used to calculate the pagination length.
   * Updated on the mapResult method according to the response data.
   */
  total = 0;
}
