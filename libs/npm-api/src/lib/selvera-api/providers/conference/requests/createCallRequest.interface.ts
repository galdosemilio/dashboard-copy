/**
 * Interface for POST /conference/video/call
 */

export interface CreateCallRequest {
    room: string;
    participants: string[];
    subaccountId: string;
}
