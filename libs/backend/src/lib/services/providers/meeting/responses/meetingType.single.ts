/**
 * GET /meeting/type/:typeId
 */

export interface MeetingTypeSingle {
  /** Meeting type ID. */
  id: number;
  /** Meeting type code. */
  code?: string;
  /** Meeting type description. */
  description: string;
  /** A flag indicating if a meeting type is currently active. */
  isActive: boolean;
}
