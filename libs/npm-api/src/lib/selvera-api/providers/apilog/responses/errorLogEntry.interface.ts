/**
 * GET /log/error
 */

export interface ErrorLogEntry {
  type: string;
  error: string;
  time: string;
}
