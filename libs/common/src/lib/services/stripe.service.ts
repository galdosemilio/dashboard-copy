import { Inject, Injectable } from '@angular/core'
import { APP_ENVIRONMENT, AppEnvironment } from '@coachcare/common/shared'
declare var Stripe: any

@Injectable()
export class StripeService {
  stripe: any

  constructor(@Inject(APP_ENVIRONMENT) environment: AppEnvironment) {
    this.stripe = Stripe(environment.stripeKey)
  }

  createToken(data: any) {
    return new Promise((resolve, reject) => {
      this.stripe.createToken(data).then(function (res: any) {
        if (res.error) {
          reject(res)
        } else {
          resolve(res)
        }
      })
    })
  }
}
