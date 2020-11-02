import * as moment from 'moment-timezone';
import { ApiService } from '../../../services/index';
import { AccSingleResponse } from '../../account/responses/index';
import { User } from '../../user/index';

import { MeasurementActivitySegment } from './entities';
import {
    AddActivityRequest,
    DeleteActivityRequest,
    FetchActivityHistoryRequest,
    FetchActivityRequest,
    FetchActivitySummaryRequest,
    FetchUnfilteredActivityRequest,
    GetSummaryMeasurementActivityRequest
} from './requests';
import {
    ActivityHistoryResponseSegment,
    FetchActivityHistoryResponse,
    FetchActivityResponse,
    FetchActivitySummaryResponse,
    FetchUnfilteredActivityResponse,
    GetSummaryMeasurementActivityResponse,
    SummaryActivityResponseSegment
} from './responses';

/**
 * User authentication and fetching/updating info of authenticated user
 */
class MeasurementActivity {
    private user: User;

    /**
     * Init Api Service
     */
    public constructor(private readonly apiService: ApiService) {
        this.user = new User(apiService);
    }

    /**
     * Fetch activity
     * @param fetchActivityRequest must implement FetchActivityRequest
     * @returns FetchActivityResponse
     */
    public fetchActivity(
        fetchActivityRequest?: FetchActivityRequest
    ): Promise<Array<FetchActivityResponse>> {
        const request: FetchUnfilteredActivityRequest = {
            clientId:
                fetchActivityRequest !== undefined &&
                fetchActivityRequest.account !== undefined
                    ? fetchActivityRequest.account
                    : undefined,
            start_date:
                fetchActivityRequest !== undefined &&
                fetchActivityRequest.startDate !== undefined
                    ? fetchActivityRequest.startDate
                    : undefined,
            end_date:
                fetchActivityRequest !== undefined &&
                fetchActivityRequest.endDate !== undefined
                    ? fetchActivityRequest.endDate
                    : undefined,
            direction:
                fetchActivityRequest !== undefined &&
                fetchActivityRequest.direction !== undefined
                    ? fetchActivityRequest.direction
                    : undefined,
            max:
                fetchActivityRequest !== undefined &&
                fetchActivityRequest.max !== undefined
                    ? fetchActivityRequest.max
                    : undefined,
            device:
                fetchActivityRequest !== undefined &&
                fetchActivityRequest.device !== undefined
                    ? fetchActivityRequest.device
                    : undefined
        };

        return this.apiService
            .request({
                endpoint: `/measurement/activity`,
                method: 'GET',
                data: request
            })
            .then(res => {
                const response = res.map(
                    (segment: FetchUnfilteredActivityResponse) => {
                        return {
                            id: segment.id,
                            userId: segment.user_id,
                            recordedAt: segment.recorded_at,
                            activityDate: segment.activity_date,
                            timezone: segment.timezone,
                            steps: segment.steps,
                            distance: segment.distance,
                            calories: segment.calories,
                            elevation: segment.elevation,
                            soft: segment.soft,
                            moderate: segment.moderate,
                            intense: segment.intense,
                            source: segment.source
                        };
                    }
                );

                return response;
            });
    }

    /**
     * Add Activity
     * @param addActivityRequest must implement AddActivityRequest
     * @returns void
     */
    public addActivity(addActivityRequest: AddActivityRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/measurement/activity`,
            method: 'POST',
            data: addActivityRequest
        });
    }

    /**
     * Delete Activity
     * @param deleteActivityRequest must implement DeleteActivityRequest
     * @returns void
     */
    public deleteActivity(
        deleteActivityRequest: DeleteActivityRequest
    ): Promise<void> {
        return this.apiService.request({
            endpoint: `/measurement/activity`,
            method: 'DELETE',
            data: deleteActivityRequest
        });
    }

    /**
     * Fetch activity history
     * @param fetchActivityHistoryRequest must implement FetchActivityHistoryRequest
     * @returns FetchActivitySummaryResponse
     */
    public fetchHistory(
        fetchActivityHistoryRequest: FetchActivityHistoryRequest
    ): Promise<FetchActivityHistoryResponse> {
        const request: [
            Promise<FetchActivityHistoryResponse>,
            Promise<AccSingleResponse>
        ] = [
            this.apiService.request({
                endpoint: `/measurement/activity/history`,
                method: 'GET',
                data: fetchActivityHistoryRequest
            }),
            this.user.get(false)
        ];

        return Promise.all(request).then(response => {
            const [measurement, user] = response;
            measurement.history.map((i: ActivityHistoryResponseSegment) => {
                i.date = moment
                    .utc(i.date)
                    .tz(user.timezone)
                    .format();
                i.recordedAt = moment
                    .utc(i.recordedAt)
                    .tz(user.timezone)
                    .format();
                return i;
            });

            return measurement;
        });
    }

    /**
     * Fetch activity summary
     * @param fetchSummaryRequest must implement FetchSummaryRequest
     * @returns FetchActivitySummaryResponse
     */
    public fetchSummary(
        fetchSummaryRequest: FetchActivitySummaryRequest
    ): Promise<FetchActivitySummaryResponse> {
        const activityRequest = {
            clientId: fetchSummaryRequest.account,
            data: fetchSummaryRequest.data,
            startDate: fetchSummaryRequest.startDate,
            endDate: fetchSummaryRequest.endDate,
            max: fetchSummaryRequest.max,
            unit: fetchSummaryRequest.unit
        };

        return this.apiService
            .request({
                endpoint: `/measurement/activity/summary`,
                method: 'GET',
                data: activityRequest
            })
            .then(res => {
                res.data = res.data.map(
                    (segment: SummaryActivityResponseSegment) => {
                        segment.date = moment
                            .utc(segment.date)
                            .format('YYYY-MM-DD');
                        return segment;
                    }
                );

                return res;
            });
    }

    /**
     * Get activity summary 2.0
     * @param fetchSummaryRequest must implement FetchSummaryRequest
     * @returns FetchActivitySummaryResponse
     */
    public getSummary(
        request: GetSummaryMeasurementActivityRequest
    ): Promise<GetSummaryMeasurementActivityResponse> {
        return this.apiService
            .request({
                endpoint: `/measurement/activity/summary`,
                method: 'GET',
                version: '2.0',
                data: request
            })
            .then(res => {
                res.data = res.data.map(
                    (segment: MeasurementActivitySegment) => {
                        segment.date = moment
                            .utc(segment.date)
                            .format('YYYY-MM-DD');
                        return segment;
                    }
                );

                return res;
            });
    }
}

export { MeasurementActivity };
