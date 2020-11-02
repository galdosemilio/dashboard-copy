/**
 * Interface for /warehouse/organization/sign-ups/timeline
 */

import { ProviderCountAggregate, TimelineSegment } from '../entities';

export interface ProviderCountSegment extends TimelineSegment<ProviderCountAggregate> {}
