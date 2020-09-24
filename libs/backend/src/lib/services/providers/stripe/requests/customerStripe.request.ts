/**
 * POST /stripe/customer
 */

export interface CustomerStripeRequest {
  /** account email. */
  email: string;
  /** token for account. */
  source: string;
}
