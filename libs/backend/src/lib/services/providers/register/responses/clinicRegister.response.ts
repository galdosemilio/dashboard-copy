/**
 * POST /ccr/register
 */

export interface ClinicRegisterResponse {
  /** Id of created provider account. */
  accountId: string;
  /** Id of created organization. */
  organizationId: string;
  /**
   * Has value 'true' if passed payment data was successfully processed by web-stripe service and customer was created,
   * otherwise 'false'. Is not included at all if payment data is not provided.
   */
  isPaymentDataProcessed?: boolean;
}
