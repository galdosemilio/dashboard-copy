/**
 * Alert Preference
 */
export interface AlertWeightChangeOptions {
  /** Indicates how many 'days' the alert goes back to analyze the data. Can be from 0 to 50 */
  daySpan: number
  /** Indicates whether a person should have at least one measurement every day in a given span of days */
  requireDailyMeasurement: boolean
  /** Indicates the point-in-time from which the alert should kick in. Will be shifted forward in time by specified 'daySpan' from the value provided. By default, the shift starts with current timestamp. */
  startDate?: string
  /** Contains threshold values to trigger alert on weight gain or loss. If 'gain' (or 'loss') is missed then the alert only examines weight loss (or gain). Gain and loss cannot be both missing at the same time. */
  threshold?: {
    /** Positive number of grams setting the level of the gain threshold. If 0 is set, any weight gain triggers threshold. */
    gain?: number
    /** Positive number of grams setting the level of the loss threshold. If 0 is set, any weight loss triggers threshold. */
    loss?: number
    /** Trigger alert when the weight change is below threshold - weight plateau case. */
    plateauAlert?: boolean
  }
  /** Indicate whether the alert should execute at the end of the day span or daily */
  triggerPeriod: 'daily' | 'spanEnd'
}

export interface AlertsWeightRegainedOptions {
  /** Specifies the base value the threshold is compared with. When not provided "all-time" is used. "enrollment" use associated preference package, if there is no association alert is not generated. */
  regainBase?: 'all-time' | 'enrollment'
  /** Specifies a threshold number which triggers the weight regained alert */
  threshold: number
}

export interface AlertsInactivityPeriod {
  period: string
}

export interface AlertsInactivityOptions {
  'meal-logging'?: AlertsInactivityPeriod
  'tracker-syncing'?: AlertsInactivityPeriod
  'weight-logging'?: AlertsInactivityPeriod
}

export type AlertsOrgOptions =
  | AlertsWeightRegainedOptions
  | AlertsInactivityOptions
  | AlertWeightChangeOptions

export interface AlertOrgPreference {
  options: AlertsOrgOptions
  isActive: boolean
}
