export class ZendeskArticle {
    public createdAt: string;
    public id: string;
    public title: string;
    public updatedAt: string;
    public url: string;

    public constructor(args: any) {
        this.createdAt = args.created_at;
        this.id = args.id;
        this.title = args.title;
        this.updatedAt = args.updated_at;
        this.url = args.html_url;
    }
}
