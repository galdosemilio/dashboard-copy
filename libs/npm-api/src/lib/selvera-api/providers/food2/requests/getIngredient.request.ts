/**
 * GET /food/ingredient/local/:id Get a local ingredient
 * GET /food/ingredient/upc/:id Look up a UPC ingredient
 * GET /food/ingredient/:id Get a remote ingredient
 */

export interface GetIngredientRequest {
  /** The id of the record. */
  id: string
  /** Language to search food database in.  accept-language header will take priority */
  lng?: string
}
