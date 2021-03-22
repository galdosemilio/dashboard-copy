import * as moment from 'moment'
import { ApiService } from '../../../services'
import { PagedResponse } from '../../content/entities'
import { MeasurementDataPointSummaryItem } from './entities'
import {
  AddBodyMeasurementRequest,
  FetchBodyMeasurementRequest,
  FetchBodyMeasurementRequestV1,
  FetchBodySummaryRequest,
  FetchUnfilteredBodyMeasurementRequest,
  GetDataPointSummaryRequest,
  GetSampledMeasurementBodyRequest,
  GetSummaryMeasurementBodyRequest
} from './requests'
import {
  BodySummaryDataResponseSegment,
  FetchBodyMeasurementResponse,
  FetchBodySummaryResponse,
  FetchUnfilteredBodyMeasurementResponse,
  GetSampledMeasurementBodyResponse,
  GetSummaryMeasurementBodyResponse
} from './responses'

/**
 * User authentication and fetching/updating info of authenticated user
 */
class MeasurementBody {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Add body measurement
   * @param addBodyMeasurementRequest must implement AddBodyMeasurementRequest
   * @returns number
   */
  public addBodyMeasurement(
    addBodyMeasurementRequest: AddBodyMeasurementRequest
  ): Promise<number> {
    return this.apiService.request({
      endpoint: `/measurement/body`,
      method: 'POST',
      data: addBodyMeasurementRequest,
      version: '2.0'
    })
  }

  /**
   * Delete body measurement
   * @param id number
   */
  public deleteBodyMeasurement(id: number | string): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/body/${id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Fetch body measurement using API v1.0
   * @deprecated
   * @param fetchBodyMeasurementRequest must implement FetchbodyMeasurementRequestV1
   * @returns FetchBodyMeasurementResponse[]
   */
  public fetchBodyMeasurementV1(
    fetchBodyMeasurementRequest?: FetchBodyMeasurementRequestV1
  ): Promise<Array<FetchBodyMeasurementResponse>> {
    const request: FetchUnfilteredBodyMeasurementRequest = {
      clientId:
        fetchBodyMeasurementRequest !== undefined &&
        fetchBodyMeasurementRequest.account !== undefined
          ? fetchBodyMeasurementRequest.account
          : undefined,
      start_date:
        fetchBodyMeasurementRequest !== undefined &&
        fetchBodyMeasurementRequest.startDate !== undefined
          ? fetchBodyMeasurementRequest.startDate
          : undefined,
      end_date:
        fetchBodyMeasurementRequest !== undefined &&
        fetchBodyMeasurementRequest.endDate !== undefined
          ? fetchBodyMeasurementRequest.endDate
          : undefined,
      direction:
        fetchBodyMeasurementRequest !== undefined &&
        fetchBodyMeasurementRequest.direction !== undefined
          ? fetchBodyMeasurementRequest.direction
          : undefined,
      max:
        fetchBodyMeasurementRequest !== undefined &&
        fetchBodyMeasurementRequest.max !== undefined
          ? fetchBodyMeasurementRequest.max
          : undefined,
      device:
        fetchBodyMeasurementRequest !== undefined &&
        fetchBodyMeasurementRequest.device !== undefined
          ? fetchBodyMeasurementRequest.device
          : undefined
    }

    return this.apiService
      .request({
        endpoint: `/measurement/body`,
        method: `GET`,
        data: request
      })
      .then((res) => {
        const response = res.map(
          (segment: FetchUnfilteredBodyMeasurementResponse) => {
            return {
              id: segment.id,
              userId: segment.user_id,
              recordedAt: moment(segment.recorded_at, 'YYYY-MM-DD').format(
                'YYYY-MM-DD'
              ),
              source: segment.source,
              weight: segment.weight,
              fatFreeMass: segment.fat_free_mass,
              bodyFat: segment.body_fat,
              fatMassWeight: segment.fat_mass_weight,
              bloodPressureDiastolic: segment.blood_pressure_diastolic,
              bloodPressureSystolic: segment.blood_pressure_systolic,
              heartRate: segment.heart_rate,
              bloodOxygenLevel: segment.blood_oxygen_level,
              boneWeight: segment.bone_weight,
              basalMetabolicRate: segment.basal_metabolic_rate,
              musclePercentage: segment.muscle_percentage,
              visceralFatPercentage: segment.visceral_fat_percentage,
              waterPercentage: segment.water_percentage,
              waist: segment.waist,
              arm: segment.arm,
              hip: segment.hip,
              chest: segment.chest,
              thigh: segment.thigh,
              neck: segment.neck,
              thorax: segment.thorax,
              totalCholesterol: segment.total_cholesterol,
              ldl: segment.ldl,
              hdl: segment.hdl,
              vldl: segment.vldl,
              triglycerides: segment.triglycerides,
              fastingGlucose: segment.fasting_glucose,
              hba1c: segment.hba1c,
              insulin: segment.insulin,
              hs_crp: segment.hs_crp,
              acetonePpm: segment.acetone_ppm,
              temperature: segment.temperature,
              respirationRate: segment.respiration_rate,
              bmi: segment.bmi,
              visceralFatTanita: segment.visceral_fat_tanita
            }
          }
        )

        return response
      })
  }

  /**
   * Fetch body measurement
   * @param request must implement FetchBodyMeasurementRequest
   * @returns FetchBodyMeasurementResponse
   */
  public fetchBodyMeasurement(
    request: FetchBodyMeasurementRequest
  ): Promise<FetchBodyMeasurementResponse> {
    return this.apiService.request({
      endpoint: `/measurement/body`,
      method: 'GET',
      data: request,
      version: '3.0'
    })
  }

  /**
   * Fetch body summary
   * @param fetchSummaryRequest must implement FetchBodySummaryRequest
   * @returns FetchBodySummaryResponse
   */
  public fetchSummary(
    fetchSummaryRequest: FetchBodySummaryRequest
  ): Promise<FetchBodySummaryResponse> {
    return this.apiService
      .request({
        endpoint: `/measurement/body/summary`,
        method: 'GET',
        data: fetchSummaryRequest
      })
      .then((res) => {
        res.data = res.data.map((segment: BodySummaryDataResponseSegment) => {
          segment.date = moment.utc(segment.date).format('YYYY-MM-DD')
          return segment
        })

        return res
      })
  }

  /**
   * Get body measurements and summary.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param [request] must implement GetSummaryMeasurementBodyRequest
   * @return Promise<GetSummaryMeasurementBodyResponse>
   */
  public getSummary(
    request?: GetSummaryMeasurementBodyRequest
  ): Promise<GetSummaryMeasurementBodyResponse> {
    return this.apiService.request({
      endpoint: `/measurement/body/summary`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  /**
   * Fetch sampled body measurement collection
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param [request] must implement GetSampledMeasurementBodyRequest
   * @return Promise<GetSampledMeasurementBodyResponse>
   */
  public getSampled(
    request?: GetSampledMeasurementBodyRequest
  ): Promise<GetSampledMeasurementBodyResponse> {
    return this.apiService.request({
      endpoint: `/measurement/body/sampled`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  /**
   * Retrieves data point summary, with first & last records and changes between them in a specified time window
   * @param request must implement GetDataPointSummaryRequest
   * @returns Promise<PagedResponse<MeasurementDataPointSummaryItem>>
   */
  public getDataPointSummary(
    request: GetDataPointSummaryRequest
  ): Promise<PagedResponse<MeasurementDataPointSummaryItem>> {
    return this.apiService.request({
      endpoint: `/measurement/data-point/summary`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }
}

export { MeasurementBody }
