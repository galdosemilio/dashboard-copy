/**
 * Interface for GET /meeting/scheduler (response)
 */

import { MeetingTimeslot } from '../entities';

export interface FetchOpenTimeslotResponse {
    data: MeetingTimeslot[];
}
