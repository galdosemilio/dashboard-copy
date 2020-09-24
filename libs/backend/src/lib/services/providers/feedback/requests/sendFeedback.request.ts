/**
 * POST /feedback
 */

import { ImageAttachment } from '../../../shared';

export interface SendFeedbackRequest {
  /** Description of the ticket. */
  description: string;
  /** Title of the ticket. */
  title?: string;
  /** Image attachements. */
  images?: Array<ImageAttachment>;
  /** User rating. */
  rating?: number;
}
