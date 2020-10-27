import { PaymentDisclaimerDialog } from '@app/dashboard/accounts/dialogs/payment-disclaimer/payment-disclaimer.dialog';
import { SectionConfigDetails } from '../models/section.details';

export const ShakeItProdSectionConfig: SectionConfigDetails = {
  PATIENT_LISTING: {
    PAYMENT_DISCLAIMER: {
      component: PaymentDisclaimerDialog
    }
  }
};

export const ShakeItTestSectionConfig: SectionConfigDetails = {
  PATIENT_LISTING: {
    PAYMENT_DISCLAIMER: {
      component: PaymentDisclaimerDialog
    }
  }
};
