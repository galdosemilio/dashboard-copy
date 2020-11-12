/**
 * POST /ccr/register
 */

export interface ClinicRegisterRequest {
  /** New account data. */
  account: {
    /** Account title ID. */
    title?: string
    /** The first name of the user. */
    firstName: string
    /** The first name of the user. */
    lastName: string
    /**
     * The email address of the user.
     * This must be unique, any existing user (active or inactive) with this email account will cause a conflict.
     */
    email: string
    /** The phone number of the user. */
    phone: string
    /** Sets account active or inactive status. Inactive accounts cannot be logged in. */
    isActive?: boolean
    /** The user's timezone, must be a valid psql timezone name such as 'America/New_York' or 'America/Los_Angeles'. */
    timezone?: string
  }
  /** Organization data. */
  organization: {
    /** The name of the organization. */
    name: string
    /** ID of the parent organization. Defaults to 'CoachCare' if not provided. */
    parentOrganizationId?: string
    /** The internal code name of the organization, must be unique. */
    shortcode?: string
    /** Organization contacts. */
    contact: {
      /** The first name of the organization contact. */
      firstName: string
      /** The last name of the organization contact. */
      lastName: string
      /** The email of the organization contact. */
      email: string
      /** The phone number of the organization contact. */
      phone?: string
    }
    /** Sets organization active status. */
    isActive?: boolean
    /** Address information. */
    address: {
      /** The street address of the organization. */
      street: string
      /** The city of the organization. */
      city: string
      /** The state of the organization. */
      state: string
      /** The postal code of the organization. */
      postalCode: string
      /** The country of the organization. Must be the two-letter ISO code. */
      country: string
    }
    /** Participante in CoachCare newsletter campaign. */
    newsletter?: boolean
  }
  /** Data to create new stripe customer. */
  paymentData?: {
    /** Stripe account email. */
    email: string
    /** Stripe token for account. */
    token: string
  }
}
