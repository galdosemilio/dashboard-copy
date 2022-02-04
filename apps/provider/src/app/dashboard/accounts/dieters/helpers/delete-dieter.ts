import * as moment from 'moment-timezone'
import { AccountAccessData, OrganizationAccess, Schedule } from '@coachcare/sdk'
import { RemovePatientMeetingDialog } from '@app/shared/dialogs'
import { MatDialog } from '@coachcare/material'
import { DieterListingItem } from '@app/shared'

export async function confirmRemoveAssociatedMeetings({
  account,
  dialog,
  organizationId,
  organizations,
  schedule
}: {
  account: DieterListingItem | AccountAccessData
  dialog: MatDialog
  organizationId: string
  organizations: Array<OrganizationAccess>
  schedule: Schedule
}): Promise<boolean> {
  const now = moment.utc()

  const currentOrg = organizations.find(
    (org) => org.organization.id === organizationId
  )

  if (!currentOrg) {
    return false
  }

  const hierarchyPath = currentOrg.organization.hierarchyPath.map((hierarchy) =>
    hierarchy.toString()
  )

  const parentOrgIds = hierarchyPath.slice(1, hierarchyPath.length)
  const allAssociatedOrgIds = organizations.map((org) => org.organization.id)

  const hasParentOrgPermission = allAssociatedOrgIds.some((orgId) =>
    parentOrgIds.includes(orgId)
  )

  if (hasParentOrgPermission) {
    return true
  }

  const response = await schedule.fetchAllMeeting({
    organization: organizationId,
    account: account.id,
    range: {
      start: now.toISOString(),
      end: now.clone().add(1, 'years').toISOString()
    },
    limit: 4
  })

  const orgsWithoutDeleted = allAssociatedOrgIds.filter(
    (org) => org !== organizationId
  )

  // We take out the meetings that are created for child orgs
  // to make sure that child associations are also considered
  const meetings = response.data.filter(
    (meeting) =>
      !orgsWithoutDeleted.includes(meeting.organization.hierarchyPath.shift())
  )

  if (meetings.length > 0) {
    return dialog
      .open(RemovePatientMeetingDialog, {
        data: {
          firstName: account.firstName,
          lastName: account.lastName,
          meetings
        }
      })
      .afterClosed()
      .toPromise()
  }

  return true
}
