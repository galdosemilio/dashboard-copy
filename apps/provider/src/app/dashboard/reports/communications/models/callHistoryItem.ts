import * as moment from 'moment';

interface CallParticipant {
  callIdentity?: string;
  email: string;
  firstName: string;
  id: string;
  isInitiator?: boolean;
  lastName: string;
}

interface CallOrganization {
  id: string;
  name: string;
}

export class CallHistoryItem {
  id: string;
  initiator: {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
  };
  organization?: CallOrganization;
  participants: CallParticipant[];
  receiver: { firstName: string; lastName: string };
  time: {
    start: string;
    end: string;
    duration: number;
  };

  constructor(args: any) {
    this.id = args.id;
    this.initiator = args.initiator;
    this.time = args.time;
    this.time.duration = Math.abs(
      moment(this.time.start).diff(moment(this.time.end), 'minutes')
    );
    this.organization = args.subaccount
      ? { id: args.subaccount.organization.id, name: args.subaccount.organization.name }
      : undefined;
    this.participants = args.participants.requested.map((participant) => ({
      email: participant.email,
      firstName: participant.firstName,
      id: participant.id,
      isInitiator: participant.id === this.initiator.id,
      lastName: participant.lastName
    }));
  }
}
