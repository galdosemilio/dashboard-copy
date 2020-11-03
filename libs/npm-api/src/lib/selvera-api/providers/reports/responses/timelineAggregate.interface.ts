/**
 * Interface for TimelineEnrollments
 */

import { ReportPackage } from '../entities';

export interface TimelineEnrollments {
    count: number;
    package: ReportPackage;
}
