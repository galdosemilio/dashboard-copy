/**
 * PUT /supplement/consumption/:id
 */

export interface UpdateSupplementConsumptionRequest {
  /** Identifier of the supplement consumption entry. */
  id: string;
  /** The quantity of supplement taken. */
  quantity: number;
}
