/**
 * Interface for PatientCountSegment
 */

import { PatientCountAggregate } from '../entities';

export interface PatientCountSegment {
    date: string;
    aggregates: Array<PatientCountAggregate>;
}
