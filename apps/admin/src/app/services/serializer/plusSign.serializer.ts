import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';
import { Injectable } from "@angular/core";

@Injectable()
export class PlusSignSerializer implements UrlSerializer {
  private defaultUrlSerializer: DefaultUrlSerializer = new DefaultUrlSerializer();

  parse(url: string): UrlTree {
    return this.defaultUrlSerializer.parse(url.replace(/\+/gi, '%2B'));
  }

  serialize(tree: UrlTree): string {
    return this.defaultUrlSerializer.serialize(tree).replace(/\+/gi, '%2B');
  }
}
