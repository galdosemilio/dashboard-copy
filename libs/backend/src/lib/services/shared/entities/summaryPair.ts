/**
 * SummaryPair
 */

import { SummaryElement } from './summaryElement';
import { SummaryProperty } from './summaryProperty';

export interface SummaryPair {
  /** Key property in the summary. */
  key: SummaryProperty;
  /** Summary element value for specific key. */
  value: SummaryElement;
}
