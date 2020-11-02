/**
 * Record
 */

export interface Record {
    /** ID of the measurement entry. */
    id: string;
    /** Recorded at timestamp. */
    recordedAt: string;
    /** Value of the record. */
    value: number;
}
