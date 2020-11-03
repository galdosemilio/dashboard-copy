/**
 * Interface for PUT /account/:client/avatar
 */

export interface AvatarSubmitRequest {
    client: string;
    avatar: string;
}
