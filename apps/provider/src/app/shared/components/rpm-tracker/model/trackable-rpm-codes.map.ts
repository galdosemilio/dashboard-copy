export interface TrackableBillableCode {
  code: string
  deps?: string[]
  displayedCode?: string
  maxEligibleAmount?: number
  requiresTimeTracking?: boolean
}
