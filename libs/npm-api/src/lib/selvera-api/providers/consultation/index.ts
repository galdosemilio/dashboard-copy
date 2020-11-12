import { ApiService } from '../../services/api.service'
import {
  ConsultationCreateRequest,
  ConsultationListingRequest
} from './requests'
import { ConsultationListingResponse, ConsultationResponse } from './responses'

/**
 * Consultaiton notes
 */
class Consultation {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch all consultation
   * @param ConsultationListingRequest
   * @returns ConsultationListingResponse
   */
  public fetchAll(
    consultationListingRequest: ConsultationListingRequest
  ): Promise<Array<ConsultationListingResponse>> {
    return this.apiService
      .request({
        endpoint: `/consultation`,
        method: `GET`,
        data: consultationListingRequest
      })
      .then((response) => {
        const records: Array<ConsultationListingResponse> = response.map(
          (e: any) => {
            return {
              internalNote: e.internal_note,
              provider: e.provider,
              providerName: e.provider_name,
              client: e.client,
              consultationTime: e.consultation_time,
              consultationType: e.consultation_type
            }
          }
        )

        return records
      })
  }

  /**
   * Fetch single consultation
   * @param consultationId
   * @returns ConsultationResponse
   */
  public fetchSingle(consultationId: string): Promise<ConsultationResponse> {
    return this.apiService
      .request({
        endpoint: `/consultation/${consultationId}`,
        method: `GET`
      })
      .then((response: any) => this.mapConsultationResponse(response))
  }

  /**
   * Create consultation
   * @param ConsultationCreateRequest
   * @returns ConsultationListingResponse
   */
  public add(
    consultationCreateRequest: ConsultationCreateRequest
  ): Promise<boolean> {
    return this.apiService
      .request({
        endpoint: `/consultation`,
        method: `POST`,
        data: consultationCreateRequest
      })
      .then((_) => true)
  }

  private mapConsultationResponse(response: any): ConsultationResponse {
    const record: ConsultationResponse = {
      provider: response.provider,
      providerName: response.provider_name,
      client: response.client,
      clientName: response.client_name,
      internalNote: response.internal_note,
      externalNote: response.external_note ? response.external_note : '',
      activityNote: response.activity_note ? response.activity_note : '',
      nutritionNote: response.nutrition_note ? response.nutrition_note : '',
      behaviorNote: response.behavior_note ? response.behavior_note : '',
      consultationMethod: response.consultation_method
        ? response.consultation_method
        : '',
      startTime: response.start_time ? response.start_time : '',
      endTime: response.end_time ? response.end_time : '',
      consultationDate: response.consultation_date,
      consultationType: response.consultation_type
    }

    return record
  }
}

export { Consultation }
