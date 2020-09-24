import { DeviceTypeIds, MFAToken } from '../entities';

export interface MFASessionRequest {
  organization: string;
  email: string;
  password: string;
  token: MFAToken;
  deviceType: DeviceTypeIds;
}
