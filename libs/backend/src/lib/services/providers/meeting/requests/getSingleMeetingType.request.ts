/**
 * GET /meeting/type/:typeId
 */

export interface GetSingleMeetingTypeRequest {
  /** The id of the meeting type, passed as the last URI parameter. */
  typeId: string;
}
