/**
 * Interface for POST /meeting/type/organization
 */

export interface AddMeetingTypeAssociationRequest {
    typeId: string;
    organization: string;
    durations: Array<string>; // postgres interval collection
}
