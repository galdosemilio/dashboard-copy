export interface LastStepComponentProps {
  onlyFirstParagraph: boolean
  clinicPlanMessage?: string
  showGoogleTagManager?: boolean
  registrationData?: {
    plan: string
    clinicId: string
    billingTerm: string
  }
}
