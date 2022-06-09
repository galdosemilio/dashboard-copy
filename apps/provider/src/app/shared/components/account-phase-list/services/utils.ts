import { _ } from '@app/shared/utils'
import { FetchPackagesSegment, PackageEnrollmentSegment } from '@coachcare/sdk'

export type PhasesDataSegment = {
  id: string | null
  package: FetchPackagesSegment
  inherited: boolean
  status: string
  enrolled: boolean
  history: { start: string; end?: string }
}

const DEFAULT_ENROLLMENT_ENTRY: PhasesDataSegment = Object.freeze({
  id: null,
  inherited: false,
  status: _('PHASE.NEVER_ENROLLED'),
  enrolled: false,
  history: { start: '', end: '' },
  package: null
})

function createPhaseDataSegment(
  rawPkg: FetchPackagesSegment,
  mostRecentEnrollment: PackageEnrollmentSegment | null,
  organizationId: string
): PhasesDataSegment {
  let enrollmentStatus = _('PHASE.NEVER_ENROLLED')

  if (mostRecentEnrollment) {
    enrollmentStatus = mostRecentEnrollment.isActive
      ? _('PHASE.CURRENTLY_ENROLLED')
      : _('PHASE.PREVIOUSLY_ENROLLED')
  }

  return {
    ...DEFAULT_ENROLLMENT_ENTRY,
    id: mostRecentEnrollment?.id ?? '',
    inherited: rawPkg.organization.id !== organizationId,
    enrolled: mostRecentEnrollment?.isActive ?? false,
    status: enrollmentStatus,
    history: {
      start: mostRecentEnrollment?.enroll.start ?? '',
      end: mostRecentEnrollment?.enroll.end ?? ''
    },
    package: rawPkg
  }
}

export const Phase = { createPhaseDataSegment }
