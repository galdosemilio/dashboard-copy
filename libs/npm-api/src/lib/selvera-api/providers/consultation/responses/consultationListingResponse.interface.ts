export interface ConsultationListingResponse {
  internalNote: string
  provider: string
  providerName: string
  client: string
  consultationTime: string
  consultationType: 'public' | 'private'
}
