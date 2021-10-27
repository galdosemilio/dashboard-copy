import * as moment from 'moment-timezone'
import { AccountAccessData, Schedule } from '@coachcare/sdk'
import { DieterListingItem } from '../models/dieterListing'
import { RemovePatientMeetingDialog } from '@app/shared/dialogs'
import { MatDialog } from '@coachcare/material'

export async function confirmRemoveAssociatedMeetings({
  account,
  dialog,
  organization,
  schedule
}: {
  account: DieterListingItem | AccountAccessData
  dialog: MatDialog
  organization: string
  schedule: Schedule
}): Promise<boolean> {
  const now = moment.utc()

  const response = await schedule.fetchAllMeeting({
    organization,
    account: account.id,
    range: {
      start: now.toISOString(),
      end: now.clone().add(1, 'years').toISOString()
    },
    limit: 4
  })

  const meetings = response.data

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
