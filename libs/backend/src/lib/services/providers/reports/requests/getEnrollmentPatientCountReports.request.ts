/**
 * GET /warehouse/enrollment/patient-count
 */

export interface GetEnrollmentPatientCountReportsRequest {
  /** The ID of the organization. */
  organization: string;
  /** The start date. */
  startDate: string;
  /** The end date. */
  endDate: string;
  /** Id of the package. */
  package?: string;
  /** A unit to aggregate the patient counts over. */
  unit?: string;
  /** In simple output mode 'child' organizations are aggregated to parent, in 'detailed' output is per-clinic. */
  mode?: string;
}
