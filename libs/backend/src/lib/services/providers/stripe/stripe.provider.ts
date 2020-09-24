import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { ChargeStripeRequest, CustomerStripeRequest } from './requests';

@Injectable({
  providedIn: 'root'
})
export class Stripe {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Create new charge.
   *
   * @param request must implement ChargeStripeRequest
   * @return Promise<any> Stripe charge object
   */
  public charge(request: ChargeStripeRequest): Promise<any> {
    return this.apiService.request({
      endpoint: `/stripe/charge`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Create and add Stripe customer.
   *
   * @param request must implement CustomerStripeRequest
   * @return Promise<void>
   */
  public customer(request: CustomerStripeRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/stripe/customer`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }
}
