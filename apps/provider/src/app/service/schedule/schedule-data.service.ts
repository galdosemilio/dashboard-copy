import { Injectable } from '@angular/core'
import { Meeting } from '@app/shared/model'
import { generateMeetingTypeColor } from '@coachcare/common/shared'
import {
  AddAttendeeRequest,
  AddMeetingRequest,
  UpdateAttendanceRequest,
  UpdateMeetingRequest
} from '@coachcare/sdk'
import { Schedule } from '@coachcare/sdk'
import { MeetingTypeEntry } from '@coachcare/sdk/dist/lib/providers/schedule/responses/fetchMeetingTypesResponse.interface'
import { sortBy } from 'lodash'

export interface MeetingTypeWithColor extends MeetingTypeEntry {
  colors: {
    default: string
    light: string
    contrast: string
  }
}

@Injectable()
export class ScheduleDataService {
  constructor(private schedule: Schedule) {}

  public async recreateMeeting(
    req: AddMeetingRequest,
    meetingId: string,
    recurring: boolean = !!req.recurring
  ): Promise<string> {
    try {
      if (recurring) {
        await this.schedule.deleteRecurringMeeting({ id: meetingId })
      } else {
        await this.schedule.deleteMeeting(meetingId)
      }

      return await this.saveMeeting(req)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  public async saveMeeting(
    req: AddMeetingRequest,
    meetingId = 0
  ): Promise<string> {
    if (!meetingId) {
      const response = await this.schedule.addMeeting(req)
      return response.meetingId
    } else {
      const request: UpdateMeetingRequest = {
        meetingId: meetingId.toString(),
        title: req.title,
        startTime: req.startTime,
        endTime: req.endTime,
        meetingTypeId: req.meetingTypeId,
        recurring: req.recurring,
        location: req.location
      }
      await this.schedule.updateMeeting(request)

      return meetingId.toString()
    }
  }

  public async fetchMeetingTypes(
    organization: string
  ): Promise<MeetingTypeWithColor[]> {
    const rawTypes = await this.schedule.fetchTypes(organization)

    return sortBy(rawTypes.meetingTypes, (t) => t.typeId).map((t, ix) => ({
      ...t,
      colors: generateMeetingTypeColor(ix)
    }))
  }

  public async fetchMeeting(id: string): Promise<Meeting> {
    return new Meeting({
      ...(await this.schedule.fetchMeeting(id)),
      access: 'full'
    })
  }

  public deleteAttendee(meetingId: string, accountId: string): Promise<void> {
    return this.schedule.deleteAttendee(meetingId, accountId)
  }

  public addAttendee(addAttendeeRequest: AddAttendeeRequest): Promise<void> {
    return this.schedule.addAttendee(addAttendeeRequest)
  }

  public updateAttendanceRequest(
    updateAttendanceRequest: UpdateAttendanceRequest
  ): Promise<void> {
    return this.schedule.updateAttendance(updateAttendanceRequest)
  }
}
