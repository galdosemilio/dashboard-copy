/**
 * Interface for POST /key
 */

export interface UpdateKeyRequest {
    id: string;
    isActive?: boolean;
    name?: string;
    description?: string;
}
