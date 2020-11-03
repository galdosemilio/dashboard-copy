import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ccrBinary' })
export class CcrBinaryPipe implements PipeTransform {
  transform(value: boolean, opts: any = {}): string {
    return value ? opts.true : opts.false;
  }
}
