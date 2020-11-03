import { Injectable } from '@angular/core';
import { MeasurementActivity, MeasurementBody, MeasurementSleep } from 'selvera-api';

import {
  AddActivityRequest,
  AddBodyMeasurementRequest,
  AddManualSleepMeasurementRequest
} from '@app/shared/selvera-api';

@Injectable()
export class MeasurementsDataService {
  constructor(
    private measurementBody: MeasurementBody,
    private measurementActivity: MeasurementActivity,
    private measurementSleep: MeasurementSleep
  ) {}

  /**
   * Save body measurement data
   */
  public addBodyMeasurementData(request: AddBodyMeasurementRequest): Promise<number> {
    return this.measurementBody
      .addBodyMeasurement(request)
      .then((res: number) => res as number)
      .catch((err) => Promise.reject(err));
  }

  /**
   * Save steps data
   */
  public addActivityData(request: AddActivityRequest): Promise<void> {
    return this.measurementActivity
      .addActivity(request)
      .then((res) => res)
      .catch((err) => Promise.reject(err));
  }

  /**
   * Save sleep hours
   */
  public addSleepData(request: AddManualSleepMeasurementRequest): Promise<void> {
    return this.measurementSleep
      .addManualSleep(request)
      .then((res) => res)
      .catch((err) => Promise.reject(err));
  }
}
