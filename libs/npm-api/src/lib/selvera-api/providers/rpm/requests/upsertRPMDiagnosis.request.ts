/**
 * Interface for PUT /rpm/state/:id/diagnosis
 */

export interface UpsertRPMDiagnosisRequest {
  id: string
  /** A note indicating why the diagnosis is being changed. Required for audited updates, discarded otherwise. */
  note?: string
  primary: string
  secondary?: string
}
