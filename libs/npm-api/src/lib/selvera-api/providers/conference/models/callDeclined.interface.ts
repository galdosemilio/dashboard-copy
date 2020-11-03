import { Participant } from './participant.interface';

export interface CallDeclined {
    callId: string;
    sentAt: string;
    declinedBy: Participant;
    type: string;
}

export const initialCallDeclined: CallDeclined = {
    callId: '',
    sentAt: '',
    declinedBy: {
        id: '',
        lastName: '',
        firstName: ''
    },
    type: ''
};
