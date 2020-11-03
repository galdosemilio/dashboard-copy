export interface MeetingSort {
    /** A property to sort by */
    property: 'start' | 'end';
    /** Sort direction */
    dir?: 'asc' | 'desc';
}
