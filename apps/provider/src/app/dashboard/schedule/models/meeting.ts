import * as moment from 'moment';

export class Meeting {
  attendees: any[];
  creator?: { email: string; firstName: string; id: string; lastName: string };
  date: moment.Moment;
  duration: number;
  endDate: moment.Moment;
  id: string;
  isFuture: boolean;
  location: any;
  organization: {
    id: string;
    hierarchy: string;
    logoUrl: string;
    name: string;
    shortCode: string;
  };
  recurring?: boolean;
  template?: any;
  time: moment.Moment;
  title: string;
  type: { id: string; description: string };

  constructor(args: any) {
    this.attendees =
      args.attendees && args.attendees.length
        ? args.attendees.map((a) => ({ ...a, account: a.id }))
        : [];
    this.creator = args.creator;
    this.date = moment(args.start.utc);
    this.endDate = moment(args.end.utc);
    this.duration = Math.abs(this.date.diff(this.endDate, 'minutes'));
    this.id = args.id;
    this.isFuture = moment().isSameOrBefore(this.date);
    this.location = args.location || {};
    this.organization = {
      ...args.organization,
      hierarchy: args.organization.hierarchyPath,
      shortCode: args.organization.shortcode
    };
    this.recurring = !!args.recurring;
    this.template = args.recurring ? args.recurring.template : undefined;
    this.time = this.date;
    this.title = args.title;
    this.type = args.type;
  }
}
