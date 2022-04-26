import { Pipe, PipeTransform } from '@angular/core'
import { MEASUREMENT_METADATA_MAP } from '@app/shared/model/measurementMetadata'
import { NamedEntity } from '@coachcare/sdk'

@Pipe({ name: 'metadataConvertToReadable' })
export class MetadataConvertToReadablePipe implements PipeTransform {
  transform(
    value: string | NamedEntity,
    parentProp: string,
    childProp: string
  ): string {
    const propEntry =
      MEASUREMENT_METADATA_MAP[parentProp]?.properties.find(
        (entry) => entry.name === childProp
      ) ?? null

    if (!propEntry) {
      return (value as NamedEntity).name ?? (value as string)
    }

    const valueEntry = propEntry.options.find(
      (opt) =>
        ((opt.value as NamedEntity).id ?? opt.value) ===
        ((value as NamedEntity).id ?? value)
    )

    return valueEntry?.viewValue ?? (value as string)
  }
}
