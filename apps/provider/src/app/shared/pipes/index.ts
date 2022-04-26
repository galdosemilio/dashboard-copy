import { AbsoluteValuePipe } from './absolute-value.pipe'
import { AccountTypePipe } from './accountType.pipe'
import { CapitalizePipe } from './capitalize.pipe'
import { CcrBinaryPipe } from './ccr-binary.pipe'
import { CcrKilobytesPipe } from './ccr-kilobytes.pipe'
import { CcrUtcPipe } from './ccr-utc.pipe'
import { ExerciseIntensityPipe } from './exercise-intensity.pipe'
import { FractionPipe } from './fraction.pipe'
import { MaxCharsPipe } from './max-chars.pipe'
import { MinutesToHoursPipe } from './minutes-to-hours.pipe'
import { NumberFormatPipe } from './number-format.pipe'
import { NumberToWeekdayPipe } from './num-to-weekday.pipe'
import { UnitConversionPipe } from './unit-conversion.pipe'
import { UnitLabelPipe } from './unit-label.pipe'
import {
  UnitConvertFromReadablePipe,
  UnitConvertToReadablePipe
} from './unit-conversion'
import { CcrSanitizePipe } from '@coachcare/common/pipes'
import {
  CcrConvertSecondsToHmsPipe,
  CcrConvertSecondsToMinutesPipe
} from './time-conversion'
import {
  MetadataConvertToReadablePipe,
  MetadataTitleConvertToReadablePipe
} from './metadata-conversion'

export const Pipes = [
  AbsoluteValuePipe,
  AccountTypePipe,
  CapitalizePipe,
  CcrBinaryPipe,
  CcrKilobytesPipe,
  CcrSanitizePipe,
  CcrConvertSecondsToHmsPipe,
  CcrConvertSecondsToMinutesPipe,
  CcrUtcPipe,
  ExerciseIntensityPipe,
  FractionPipe,
  MaxCharsPipe,
  MetadataConvertToReadablePipe,
  MetadataTitleConvertToReadablePipe,
  MinutesToHoursPipe,
  NumberFormatPipe,
  NumberToWeekdayPipe,
  UnitConversionPipe,
  UnitConvertFromReadablePipe,
  UnitConvertToReadablePipe,
  UnitLabelPipe
]
