interface ConfirmPaymentErrorArgs {
  message: string
  paymentIntentAuthFailure?: boolean
}

export class ConfirmPaymentError extends Error {
  public paymentIntentAuthFailure: boolean = false

  constructor(args: ConfirmPaymentErrorArgs) {
    super(args.message)
    this.paymentIntentAuthFailure = args.paymentIntentAuthFailure ?? false
  }
}
