import {
  AddAttendanceEntryRequest,
  AddAttendeeRequest,
  AddMeetingRequest,
  AddMeetingTypeAssociationRequest,
  AddMeetingTypeRequest,
  AddRecurrentAvailabilityRequest,
  AddSingleAvailabilityRequest,
  DeleteRecurringMeetingRequest,
  FetchAllAttendanceStatusAssociationsRequest,
  FetchAllAttendanceStatusEntriesRequest,
  FetchAllMeetingRequest,
  FetchCalendarAvailabilityRequest,
  FetchOpenTimeslotRequest,
  FetchProviderAvailabilityRequest,
  FetchScheduleSummaryRequest,
  SearchProviderAvailabilityRequest,
  SetTimezoneRequest,
  UpdateAttendanceRequest,
  UpdateMeetingRequest,
  UpdateMeetingTypeRequest
} from '../../providers/schedule/requests'
import {
  AddMeetingResponse,
  AddRecurrentAvailabilityResponse,
  AddSingleAvailabilityResponse,
  FetchAllMeetingResponse,
  FetchAvailabilityResponse,
  FetchCalendarAvailabilityResponse,
  FetchMeetingResponse,
  FetchMeetingTypesResponse,
  FetchOpenTimeslotResponse,
  FetchProviderAvailabilitySegment,
  FetchRecurrentAvailabilitySegment,
  FetchSummaryResponse,
  SearchProviderAvailabilityResponse
} from '../../providers/schedule/responses'
import { ApiService } from '../../services/index'
import { Entity } from '../common/entities'
import { PagedResponse } from '../content/entities'
import { AttendanceStatusAssociation, AttendanceStatusEntry } from './entities'

/**
 * Schedule Service. Fetching and setting schedules
 */
class Schedule {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Create attendance status entry
   * @param data must implement AddAttendanceEntryRequest
   * @returns Promise<Entity>
   */
  public addAttendanceStatusEntry(
    data: AddAttendanceEntryRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: data,
      endpoint: '/meeting/attendance/status',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Removes attendance status entry
   * @param data must implement Entity
   * @returns Promise<void>
   */
  public deleteAttendanceStatusEntry(data: Entity): Promise<void> {
    return this.apiService.request({
      data: data,
      endpoint: `/meeting/attendance/status/${data.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Get attendance status entry list
   * @param data must implement FetchAllAttendanceStatusEntriesRequest
   * @returns Promise<PagedResponse<AttendanceEntry>>
   */
  public fetchAllAttendanceStatusEntries(
    data: FetchAllAttendanceStatusEntriesRequest
  ): Promise<PagedResponse<AttendanceStatusEntry>> {
    return this.apiService.request({
      data: data,
      endpoint: '/meeting/attendance/status',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Get attendance status entry list for an organization
   * @param data must implement FetchAllAttendanceStatusAssociationsRequest
   * @returns Promise<PagedResponse<AttendanceEntry>>
   */
  public fetchAllAttendanceStatusAssociations(
    data: FetchAllAttendanceStatusAssociationsRequest
  ): Promise<PagedResponse<AttendanceStatusAssociation>> {
    return this.apiService.request({
      data: data,
      endpoint: '/meeting/attendance/status/organization',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Get attendance status entry
   * @param data must implement Entity
   * @returns Promise<AttendanceEntry>
   */
  public fetchAttendanceStatusEntry(
    data: Entity
  ): Promise<AttendanceStatusEntry> {
    return this.apiService.request({
      data: data,
      endpoint: `/meeting/attendance/${data.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Update attendance status entry
   * @param data must implement Partial<AttendanceEntry>
   * @returns Promise<AttendanceEntry>
   */
  public updateAttendaceStatusEntry(
    data: Partial<AttendanceStatusEntry>
  ): Promise<void> {
    return this.apiService.request({
      data: data,
      endpoint: `/meeting/attendance/status/${data.id}`,
      method: 'PATCH',
      version: '1.0'
    })
  }

  /**
   * Fetch Meeting Types by Organization
   * @param organization Organization ID
   * @returns FetchMeetingTypesResponse[]
   */
  public fetchTypes(
    organization: string
  ): Promise<Array<FetchMeetingTypesResponse>> {
    return this.apiService
      .request({
        endpoint: `/meeting/type/organization/${organization}`,
        method: 'GET',
        version: '2.0'
      })
      .then((res) => res.meetingTypes)
  }

  /**
   * Associate Meeting Type with Organization
   * @param addMeetingTypeAssociationRequest must implement AddMeetingTypeAssociationRequest
   * @returns void
   */
  public addTypeAssociation(
    addMeetingTypeAssociationRequest: AddMeetingTypeAssociationRequest
  ): Promise<void> {
    return this.apiService.request({
      endpoint: '/meeting/type/organization',
      method: 'POST',
      data: addMeetingTypeAssociationRequest,
      version: '2.0'
    })
  }

  /**
   * Update Meeting Type Association
   * @param updateMeetingTypeAssociationRequest must implement AddMeetingTypeAssociationRequest
   * @returns void
   */
  public updateTypeAssociation(
    updateMeetingTypeAssociationRequest: AddMeetingTypeAssociationRequest
  ): Promise<void> {
    return this.apiService.request({
      endpoint: '/meeting/type/organization',
      method: 'PUT',
      data: updateMeetingTypeAssociationRequest,
      version: '2.0'
    })
  }

  /**
   * Delete Meeting Type Association
   * @param id ID of the meeting
   * @param organization Organization ID
   * @returns void
   */
  public deleteTypeAssociation(
    typeId: string,
    organization: string
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/type/${typeId}/organization/${organization}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Fetch All Meeting
   * @param fetchAllMeetingRequest must implement FetchAllMeetingRequest
   * @returns FetchAllMeetingResponse
   */
  public fetchAllMeeting(
    fetchAllMeetingRequest?: FetchAllMeetingRequest
  ): Promise<FetchAllMeetingResponse> {
    return this.apiService.request({
      endpoint: '/meeting',
      method: 'GET',
      data: fetchAllMeetingRequest,
      version: '4.0'
    })
  }

  /**
   * Fetch Single Meeting
   * @param id ID of the meeting
   * @returns FetchMeetingResponse
   */
  public fetchMeeting(id: string): Promise<FetchMeetingResponse> {
    return this.apiService.request({
      endpoint: `/meeting/${id}`,
      method: 'GET',
      version: '3.0'
    })
  }

  /**
   * Add Meeting
   * @param addMeetingRequest must implement AddMeetingRequest
   * @returns AddMeetingResponse
   */
  public addMeeting(
    addMeetingRequest: AddMeetingRequest
  ): Promise<AddMeetingResponse> {
    return this.apiService.request({
      endpoint: '/meeting',
      method: 'POST',
      data: addMeetingRequest,
      version: '2.0'
    })
  }

  /**
   * Update Meeting
   * @param updateMeetingRequest must implement UpdateMeetingRequest
   * @returns void
   */
  public updateMeeting(
    updateMeetingRequest: UpdateMeetingRequest
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/${updateMeetingRequest.meetingId}`,
      method: 'PUT',
      data: updateMeetingRequest,
      version: '2.0'
    })
  }

  /**
   * Delete Meeting
   * @param id ID of the meeting
   * @returns void
   */
  public deleteMeeting(id: string): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/single/${id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Delete Recurring Meeting
   * @param request must implement DeleteRecurringMeetingRequest
   * @returns Promise<void>
   */
  public deleteRecurringMeeting(
    request: DeleteRecurringMeetingRequest
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/recurring/${request.id}${
        request.after ? '?after=' + encodeURIComponent(request.after) : ''
      }`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Add Attendee to Meeting
   * @param addAttendeeRequest must implement AddAttendeeRequest
   * @returns void
   */
  public addAttendee(addAttendeeRequest: AddAttendeeRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/attendee`,
      method: 'POST',
      data: addAttendeeRequest,
      version: '2.0'
    })
  }

  /**
   * Set Attendance Status for a specific Account and Meeting
   * @param updateAttendanceRequest must implement UpdateAttendanceRequest
   * @returns void
   */
  public updateAttendance(
    updateAttendanceRequest: UpdateAttendanceRequest
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/attendance/${updateAttendanceRequest.id}`,
      method: 'PATCH',
      data: updateAttendanceRequest,
      version: '3.0'
    })
  }

  /**
   * Delete an Attendee from a Single Meeting
   * @param accountId The id of the account to remove from the meeting
   * @param meetingId The id of the meeting
   * @returns void
   */
  public deleteAttendee(meetingId: string, accountId: string): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/${meetingId}/attendee/${accountId}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Search Provider Match
   * @param searchProviderAvailabilityRequest must implement SearchProviderAvailabilityRequest
   * @returns SearchProviderAvailabilityResponse
   */
  public searchProviderAvailability(
    searchProviderAvailabilityRequest?: SearchProviderAvailabilityRequest
  ): Promise<SearchProviderAvailabilityResponse> {
    return this.apiService.request({
      endpoint: '/available/match',
      method: 'GET',
      data: searchProviderAvailabilityRequest,
      version: '2.0'
    })
  }

  /**
   * Fetch Provider Availability
   * Fetch a list of open timeslots for a user, up to 7 days
   * @param searchProviderAvailabilityRequest must implement FetchProviderAvailabilityRequest
   * @returns Array<FetchProviderAvailabilityResponse>
   */
  public fetchProviderAvailability(
    fetchProviderAvailabilityRequest?: FetchProviderAvailabilityRequest
  ): Promise<Array<FetchProviderAvailabilitySegment>> {
    return this.apiService.request({
      endpoint: '/scheduler',
      method: 'GET',
      data: fetchProviderAvailabilityRequest,
      version: '2.0'
    })
  }

  /**
   * Fetch Open Available Timeslots
   * Fetch a list of open timeslots for a user
   * @param fetchOpenTimeslotRequest must implement FetchOpenTimeslotRequest
   * @returns FetchOpenTimeslotResponse
   */
  public fetchOpenTimeslots(
    fetchOpenTimeslotRequest?: FetchOpenTimeslotRequest
  ): Promise<FetchOpenTimeslotResponse> {
    return this.apiService.request({
      endpoint: '/meeting/scheduler',
      method: 'GET',
      data: fetchOpenTimeslotRequest,
      version: '3.0'
    })
  }

  /**
   * Get Account Usage
   * @param fetchSummaryRequest must implement FetchSummaryRequest
   * @returns FetchSummaryResponse
   */
  public fetchSummary(
    fetchSummaryRequest?: FetchScheduleSummaryRequest
  ): Promise<FetchSummaryResponse> {
    return this.apiService.request({
      endpoint: '/schedule/summary',
      method: 'GET',
      data: fetchSummaryRequest,
      version: '2.0'
    })
  }

  /**
   * Fetch Recurrent Provider Availability
   * @param provider The id of the provider to fetch availability for
   * @returns Array<FetchRecurrentAvailabilitySegment>
   */
  public fetchRecurrentAvailability(
    provider?: string
  ): Promise<Array<FetchRecurrentAvailabilitySegment>> {
    return this.apiService.request({
      endpoint: '/available',
      method: 'GET',
      data: { provider },
      version: '2.0'
    })
  }

  /**
   * Fetch Availability Calendar Entries
   * @param fetchCalendarAvailabilityRequest must implement FetchCalendarAvailabilityRequest
   * @returns FetchCalendarAvailabilityResponse
   */
  public fetchCalendarAvailability(
    fetchCalendarAvailabilityRequest?: FetchCalendarAvailabilityRequest
  ): Promise<FetchCalendarAvailabilityResponse> {
    return this.apiService.request({
      endpoint: '/available/calendar',
      method: 'GET',
      data: fetchCalendarAvailabilityRequest,
      version: '2.0'
    })
  }

  /**
   * Get Availability Record
   * @param id The id of the record to fetch
   * @returns FetchAvailabilityResponse
   */
  public fetchAvailability(id: string): Promise<FetchAvailabilityResponse> {
    return this.apiService.request({
      endpoint: `/available/${id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Add Availability Record
   * @param addRecurrentAvailabilityRequest must implement AddRecurrentAvailabilityRequest
   * @returns AddRecurrentAvailabilityResponse
   */
  public addRecurrentAvailability(
    addRecurrentAvailabilityRequest: AddRecurrentAvailabilityRequest
  ): Promise<AddRecurrentAvailabilityResponse> {
    return this.apiService.request({
      endpoint: '/available',
      method: 'POST',
      data: addRecurrentAvailabilityRequest,
      version: '2.0'
    })
  }

  /**
   * Add Single Availability
   * @param addSingleAvailabilityRequest must implement AddSingleAvailabilityRequest
   * @returns AddSingleAvailabilityResponse
   */
  public addSingleAvailability(
    addSingleAvailabilityRequest: AddSingleAvailabilityRequest
  ): Promise<AddSingleAvailabilityResponse> {
    return this.apiService.request({
      endpoint: '/available/single',
      method: 'POST',
      data: addSingleAvailabilityRequest,
      version: '2.0'
    })
  }

  /**
   * Delete Recurrent Availability Template
   * @param id ID of the availability template
   * @returns void
   */
  public deleteRecurrentAvailability(id: string): Promise<void> {
    return this.apiService.request({
      endpoint: `/available/${id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Delete Availability Calendar Entry
   * @param id ID of the availability calendar entry
   * @returns void
   */
  public deleteSingleAvailability(id: string): Promise<void> {
    return this.apiService.request({
      endpoint: `/available/single/${id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Delete All Availability for User
   * @param provider ID of the provider
   * @returns void
   */
  public deleteAllAvailability(provider: string): Promise<void> {
    return this.apiService.request({
      endpoint: `/available/account/${provider}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Set Timezone for Accounts
   * @param setTimezoneRequest must implement SetTimezoneRequest
   * @returns void
   */
  public setTimezone(setTimezoneRequest: SetTimezoneRequest): Promise<void> {
    return this.apiService.request({
      endpoint: '/available/timezone',
      method: 'POST',
      data: setTimezoneRequest,
      version: '2.0'
    })
  }

  /**
   * Add Meeting Type (Restricted to Admin)
   * @param addMeetingTypeRequest must implement AddMeetingTypeRequest
   * @returns string Type ID
   */
  public addType(
    addMeetingTypeRequest: AddMeetingTypeRequest
  ): Promise<string> {
    return this.apiService.request({
      endpoint: '/meeting/type',
      method: 'POST',
      data: addMeetingTypeRequest,
      version: '2.0'
    })
  }

  /**
   * Update Meeting Type (Restricted to Admin)
   * @param updateMeetingTypeRequest must implement UpdateMeetingTypeRequest
   * @returns string Type ID
   */
  public updateType(
    updateMeetingRequest: UpdateMeetingTypeRequest
  ): Promise<string> {
    return this.apiService.request({
      endpoint: `/meeting/type/${updateMeetingRequest.typeId}`,
      method: 'PATCH',
      data: updateMeetingRequest,
      version: '2.0'
    })
  }

  /**
   * Deactivate Meeting Type (Restricted to Admin)
   * @param typeId Type ID
   * @returns string Type ID
   */
  public deactivateType(typeId: string): Promise<string> {
    return this.apiService.request({
      endpoint: `/meeting/type/${typeId}`,
      method: 'PATCH',
      data: { isActive: false },
      version: '2.0'
    })
  }

  /**
   * Activate Meeting Type (Restricted to Admin)
   * @param typeId Type ID
   * @returns string Type ID
   */
  public activateType(typeId: string): Promise<string> {
    return this.apiService.request({
      endpoint: `/meeting/type/${typeId}`,
      method: 'PATCH',
      data: { isActive: true },
      version: '2.0'
    })
  }

  /**
   * Quick meeting cancel (Restricted to Admin)
   * @param token
   * @returns void
   */
  public quickCancelMeeting(token: string): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/quick/${token}`,
      method: 'DELETE',
      version: '2.0'
    })
  }
}

export { Schedule }
