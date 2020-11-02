/**
 * Interface for PUT /attendance
 */

export interface UpdateAttendanceRequest {
    /** @deprecated this property is no longer supported */
    account?: string;
    /** @deprecated this property is no longer supported */
    attended?: boolean;
    /** Attendance entry ID */
    id: string;
    /** @deprecated this property is no longer supported */
    meetingId?: string;
    /** Status ID */
    status: string;
}
