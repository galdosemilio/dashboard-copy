import { AttendanceStatusEntry } from './attendanceStatusEntry.interface';

export interface AttendanceStatusAssociation {
    /** Associated attendance status */
    attendanceStatus: AttendanceStatusEntry;
    /** Association ID */
    id: string;
    /** Organization associated with status */
    organization: { id: string };
    /** Associated attendance status */
    status: 'active' | 'inactive';
}
