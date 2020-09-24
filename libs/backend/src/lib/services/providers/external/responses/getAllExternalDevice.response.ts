/**
 * GET /measurement/device
 */

export interface GetAllExternalDeviceResponse {
  /** Array of measurement devices objects. */
  data: Array<{
    /** The device id. */
    id: string;
    /** The title. */
    title: string;
    /** The device description. */
    description: string;
    /** The device adding timestamp. */
    addedAt: string;
  }>;
}
