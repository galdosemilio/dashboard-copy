import { Injectable } from '@angular/core'
import * as moment from 'moment'
import { Schedule } from '@coachcare/npm-api'

import { Meeting } from '@app/dashboard/schedule/models'
import { FetchAllMeetingRequest } from '@coachcare/npm-api'

@Injectable()
export class NotificationsDataService {
  constructor(private schedule: Schedule) {}

  /**
   * Get user's upcoming meetings
   */
  public getMeetings(req: FetchAllMeetingRequest): Promise<Meeting[]> {
    return this.schedule
      .fetchAllMeeting(req)
      .then((response) => response.data.map((r) => new Meeting(r)))
      .catch((err) => Promise.reject(err))
  }

  public groupByDate(
    meetings: Meeting[],
    dateFormat?: string,
    limit?: number
  ): Array<any> {
    const dateSections = []

    for (const k of Array.from(meetings.keys())) {
      if (limit && k === limit) {
        return dateSections
      }

      const meeting = meetings[k]
      const meetingDate = dateFormat
        ? moment(meeting.date).format(dateFormat)
        : moment(meeting.date).format('dddd, LL')

      const targetSection = dateSections.find(
        (section) => section.date === meetingDate
      )

      if (targetSection) {
        targetSection.meetings.push(meeting)
      } else {
        dateSections.push({ date: meetingDate, meetings: [meeting] })
      }
    }

    return dateSections
  }
}
