/**
 * Interface for GET /warehouse/demographics/age
 */

import { AggregateLevel } from '../entities';
import { DemographicsRequest } from './demographicsRequest.interface';

export interface AgeDemographicsRequest extends DemographicsRequest {
    age: Array<AggregateLevel>;
}
