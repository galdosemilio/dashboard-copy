export interface CallAborted {
    callId: string;
    sentAt: string;
    type: string;
}

export const initialCallAborted = {
    callId: '',
    sentAt: '',
    type: ''
};
