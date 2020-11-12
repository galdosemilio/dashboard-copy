import { CcrDataSource } from './generic.datasource'

export abstract class TableDataSource<T, R, C> extends CcrDataSource<T, R, C> {
  /**
   * Used to calculate the pagination length.
   * Updated on the mapResult method according to the response data.
   */
  public total = 0
  public pageIndex = 0
  public pageSize = 10

  public resetPaginator() {
    this.total = 0
    this.pageIndex = 0
  }
}
