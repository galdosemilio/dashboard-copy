/**
 * Interface for GET /measurement/device/sync (response)
 */

import { SyncedDeviceDate } from '../entities';

export interface DeviceSyncResponse {
    data: Array<SyncedDeviceDate>;
}
