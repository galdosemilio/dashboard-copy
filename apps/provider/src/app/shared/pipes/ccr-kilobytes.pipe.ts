import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ccrKilobytes' })
export class CcrKilobytesPipe implements PipeTransform {
  transform(value: number): number {
    return Math.ceil(value / 1024);
  }
}
