import { Pipe, PipeTransform } from '@angular/core'
import { MEASUREMENT_METADATA_MAP } from '@app/shared/model/measurementMetadata'

@Pipe({ name: 'metadataTitleConvertToReadable' })
export class MetadataTitleConvertToReadablePipe implements PipeTransform {
  transform(value: string, childProp: string): string {
    const propEntry =
      MEASUREMENT_METADATA_MAP[value]?.properties.find(
        (entry) => entry.name === childProp
      ) ?? null

    return propEntry?.displayName ?? childProp
  }
}
