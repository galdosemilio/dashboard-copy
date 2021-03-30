import { AccountRef } from '../../account/entities'
import { Entity } from '../../common/entities'

export interface RPMDiagnosisAuditNote {
  current: string
  previous?: string
}

export interface RPMDiagnosisAuditEntry {
  account: AccountRef
  createdAt?: string
  note?: string
  primary: RPMDiagnosisAuditNote
  secondary?: RPMDiagnosisAuditNote
  state: Entity
}
