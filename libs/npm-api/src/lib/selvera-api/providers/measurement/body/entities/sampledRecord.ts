/**
 * SampledRecord
 */

export interface SampledRecord {
    /** ID of measurement record. */
    id: number;

    /** The timestamp of the measurement record as an ISO date string. */
    recordedAt: string;

    /** The id of the account to which the measurement belongs */
    account: string;

    /** The timestamp the measurement was updated. */
    updatedAt?: string;

    /** The value for requested data parameter */
    value: string;
}
