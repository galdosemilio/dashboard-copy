/**
 * Interface for PATCH /account/:account/external-identifier/:id (Request)
 */

export interface UpdateIdentifierRequest {
  account: string;
  id: string;
  name: string;
  isActive: boolean;
}
