/**
 * POST /logging
 */

import { LoggingLevel } from '../../../shared';

export interface CreateLoggingRequest {
  /** The id of the app from which the record was generateed. */
  app: string;
  /** An array of strings to identify the record. */
  keywords?: Array<string>;
  /** The level of severity of this record. */
  logLevel: LoggingLevel;
  /** The message to record - can be any string or JSON value. */
  message: string;
}
