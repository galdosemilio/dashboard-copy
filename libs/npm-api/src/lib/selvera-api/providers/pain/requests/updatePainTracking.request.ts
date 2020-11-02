/**
 * PATCH /pain-tracking/history/:id
 */

import { PainIntensity } from '../entities';

export interface UpdatePainTrackingRequest {
    /** ID of the pain location specified for update. */
    id: string;
    /** Pain interval in hh:mm:ss format. */
    duration?: string;
    /** Pain type: 1-General | 2-Pounding | 3-Throbbing | 4-Stabbing. */
    type?: number;
    /** Pain intensity in range [0, 10]. */
    intensity?: PainIntensity;
}
