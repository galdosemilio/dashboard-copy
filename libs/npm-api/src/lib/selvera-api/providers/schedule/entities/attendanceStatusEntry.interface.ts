export interface AttendanceStatusEntry {
    /** Attendance status entry ID */
    id: string;
    /** Attendance status entry name */
    name: string;
    /** Attendance status entry status */
    status: 'active' | 'inactive';
}
