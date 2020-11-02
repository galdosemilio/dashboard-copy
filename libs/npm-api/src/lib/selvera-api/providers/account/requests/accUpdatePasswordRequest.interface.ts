/**
 * Interface for POST /account/password
 */

export interface AccUpdatePasswordRequest {
    password: {
        old: string;
        new: string;
    };
    organization: string;
}
