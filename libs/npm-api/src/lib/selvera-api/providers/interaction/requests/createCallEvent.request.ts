/**
 * Interface for POST /communication/interaction/call/{id}/event
 */
export interface CreateCallEventRequest {
    event: string;
    id: string;
}
