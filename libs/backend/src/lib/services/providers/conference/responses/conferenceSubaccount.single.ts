/**
 * GET /conference/subaccount/:id
 */

import { Entity } from '../../../shared';

export interface ConferenceSubaccountSingle {
  /** Subaccount ID. */
  id: string;
  /** Organization ref. */
  organization: Entity;
  /** Subaccount creation timestamp. */
  createdAt: string;
  /** Subaccount latest modification timestamp. */
  updatedAt?: string;
  /** Activity flag. */
  isActive: boolean;
  /** A flag indicating if the subaccount has access keys set up for it. */
  hasKeys: boolean;
}
