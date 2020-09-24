/**
 * BillingSummaryItem
 */

import { Entity } from '../generic';
import { ConferenceSubaccountInfo } from './conferenceSubaccountInfo';
import { MeasuredValue } from './measuredValue';

export interface BillingSummaryItem {
  /** Organization information. */
  organization: Entity;
  /** Subaccount information. */
  subaccount: ConferenceSubaccountInfo;
  /** Count of events. */
  count: MeasuredValue;
  /** Price for a specific category service. */
  price: MeasuredValue;
  /** Usage breakdown of specific category. */
  usage: MeasuredValue;
}
