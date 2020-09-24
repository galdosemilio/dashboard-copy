import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';

export class PlusSignSerializer implements UrlSerializer {
  private defaultUrlSerializer: DefaultUrlSerializer = new DefaultUrlSerializer();

  parse(url: string): UrlTree {
    return this.defaultUrlSerializer.parse(url.replace(/\+/gi, '%2B'));
  }

  serialize(tree: UrlTree): string {
    return this.defaultUrlSerializer.serialize(tree).replace(/\+/gi, '%2B');
  }
}
