/**
 * POST /stripe/charge
 */

export interface ChargeStripeRequest {
  /** Charge currency. */
  currency: string;
  /** Charge amount. */
  amount: string;
  /** Charge description (optional) */
  description: string;
}
