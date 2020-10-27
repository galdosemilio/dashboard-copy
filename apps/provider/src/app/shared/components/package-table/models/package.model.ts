import { ContentOrganization, FetchPackagesSegment } from '@app/shared/selvera-api';

export class Package implements FetchPackagesSegment {
  public id: string;
  public title: string;
  public shortcode: string;
  public organization: ContentOrganization | any;
  public createdAt: string;
  public isActive: boolean;
  public checked: boolean;

  constructor(args: any) {
    this.id = args.id.toString();
    this.title = args.title;
    this.shortcode = args.shortcode;
    this.organization = args.organization;
    this.createdAt = args.createdAt;
    this.isActive = args.isActive;
    this.checked = args.checked;
  }
}
