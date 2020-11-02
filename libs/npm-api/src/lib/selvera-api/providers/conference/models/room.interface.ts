import { initialOrganization, Organization } from './organization.interface';
import { initialParticipant, Participant } from './participant.interface';

export interface Room {
    callId: string;
    room: string;
    organization: Organization;
    recipient: Participant;
    initiator: Participant;
}

export const initialRoom: Room = {
    callId: '',
    room: '',
    organization: initialOrganization,
    recipient: initialParticipant,
    initiator: initialParticipant
};
