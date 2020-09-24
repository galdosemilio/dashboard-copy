/**
 * ConferenceSubaccountInfo
 */

export interface ConferenceSubaccountInfo {
  /** Subaccount Twillio ID. */
  sid: string;
  /** A flag indicating if subaccount is active or not. */
  isActive: boolean;
  /** Start date of the billing breakdown. */
  startDate: string;
  /** End date of the billing breakdown. */
  endDate: string;
  /** Billing description. */
  description: string;
  /** Twilio's billing category. */
  category: string;
}
