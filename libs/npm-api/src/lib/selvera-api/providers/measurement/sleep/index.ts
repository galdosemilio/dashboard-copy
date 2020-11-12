import * as moment from 'moment'
import { ApiService } from '../../../services/index'
import {
  AddManualSleepMeasurementRequest,
  AddSleepMeasurementRequest,
  FetchSleepMeasurementRequest,
  FetchSleepMeasurementSummaryRequest,
  FetchUnfilteredSleepMeasurementRequest
} from './requests'
import {
  FetchSleepMeasurementResponse,
  FetchSleepMeasurementSummaryResponse,
  FetchUnfilteredSleepMeasurementResponse
} from './responses'

/**
 * User authentication and fetching/updating info of authenticated user
 */
class MeasurementSleep {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch sleep
   * @param request must implement FetchSleepMeasurementRequest
   * @returns FetchSleepMeasurementResponse
   */
  public fetchSleep(
    request?: FetchSleepMeasurementRequest
  ): Promise<Array<FetchSleepMeasurementResponse>> {
    const data: FetchUnfilteredSleepMeasurementRequest = {
      client_id: request && request.account ? request.account : undefined,
      start_date: request && request.startDate ? request.startDate : undefined,
      end_date: request && request.endDate ? request.endDate : undefined
    }

    return this.apiService
      .request({
        endpoint: `/measurement/sleep`,
        method: 'GET',
        data
      })
      .then((res) => {
        const response = res.map(
          (i: FetchUnfilteredSleepMeasurementResponse) => {
            return {
              id: i.id,
              userId: i.user_id,
              recordedAt: i.recorded_at,
              sleepDate: i.sleep_date,
              timezone: i.timezone,
              sleepStart: moment.utc(i.sleep_start).format(),
              sleepEnd: moment
                .utc(i.sleep_start)
                .add(i.total, 'seconds')
                .format(),
              total: i.total,
              timeToSleep: i.time_to_sleep,
              wakeUpCount: i.wake_up_count,
              deepSleep: i.deep_sleep,
              wakeUp: i.wake_up,
              lightSleep: i.light_sleep,
              remSleep: i.rem_sleep,
              source: i.source
            }
          }
        )

        return response
      })
  }

  /**
   * Add Sleep Measurement
   * @param addSleepMeasurementRequest must implement AddSleepMeasurementRequest
   * @returns void
   */
  public addSleep(
    addSleepMeasurementRequest: AddSleepMeasurementRequest
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/sleep`,
      method: 'POST',
      data: addSleepMeasurementRequest
    })
  }

  /**
   * Add Manual Sleep Measurement
   * @param addManualSleepMeasurementRequest must implement AddManualSleepMeasurementRequest
   * @returns void
   */
  public addManualSleep(
    addManualSleepMeasurementRequest: AddManualSleepMeasurementRequest
  ): Promise<void> {
    addManualSleepMeasurementRequest.quality = addManualSleepMeasurementRequest.quality
      ? addManualSleepMeasurementRequest.quality
      : 50
    const sleep = this.getSegmentedTime(
      addManualSleepMeasurementRequest.startTime,
      addManualSleepMeasurementRequest.endTime,
      addManualSleepMeasurementRequest.quality
    )
    const addSleep: AddSleepMeasurementRequest = {
      clientId: addManualSleepMeasurementRequest.clientId,
      deviceId: addManualSleepMeasurementRequest.deviceId,
      sleep: sleep
    }
    return this.addSleep(addSleep)
  }

  /**
   * Get the time duration segmented in to 15 min intervals
   * @param startTime string
   * @param endTime string
   * @returns Array
   */
  public getSegmentedTime(
    startTime: string,
    endTime: string,
    quality?: number
  ): Array<Array<{ time: string; quality: number }>> {
    const arr: any[] = [[]]
    let s = moment.parseZone(startTime)
    const e = moment(endTime)
    do {
      arr[0].push({
        time: s.format('YYYY-MM-DDTHH:mm:ssZ'),
        quality: quality ? quality : 50
      })
      s = s.add(15, 'minutes')
    } while (s < e)
    return arr
  }

  /**
   * Fetch sleep summary
   * @param fetchSleepMeasurementSummaryRequest must implement FetchSleepMeasurementSummaryRequest
   * @returns FetchSleepMeasurementSummaryResponse
   */
  public fetchSummary(
    fetchSleepMeasurementSummaryRequest: FetchSleepMeasurementSummaryRequest
  ): Promise<FetchSleepMeasurementSummaryResponse> {
    const sleepRequest = {
      clientId: fetchSleepMeasurementSummaryRequest.account,
      data: fetchSleepMeasurementSummaryRequest.data,
      startDate: fetchSleepMeasurementSummaryRequest.startDate,
      endDate: fetchSleepMeasurementSummaryRequest.endDate,
      max: fetchSleepMeasurementSummaryRequest.max,
      unit: fetchSleepMeasurementSummaryRequest.unit
    }

    return this.apiService.request({
      endpoint: `/measurement/sleep/summary`,
      method: 'GET',
      data: sleepRequest
    })
  }
}

export { MeasurementSleep }
