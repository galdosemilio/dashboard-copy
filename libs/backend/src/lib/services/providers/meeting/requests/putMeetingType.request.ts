/**
 * PUT /meeting/type/:typeId
 */

export interface PutMeetingTypeRequest {
  /** The id of the meetingType, passed as the last URI parameter. */
  typeId: string;
  /** Code of an type. */
  code: string;
  /** Description of an type. */
  description: string;
  /** Status of an type. */
  isActive: boolean;
}
