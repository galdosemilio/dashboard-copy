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
import {
  CcrConvertSecondsToHmsPipe,
  CcrConvertSecondsToMinutesPipe
} from './time-conversion'
import {
  MetadataConvertToReadablePipe,
  MetadataTitleConvertToReadablePipe
} from './metadata-conversion'
import {
  DataPointMissingAlertHint,
  DataPointMissingNotificationHintPipe,
  DataThresholdAlertHintPipe,
  DataThresholdNotificationHintPipe
} from './alert-hint'
import { DataTypeNamePipe } from './data-types'
import { OrganizationNamePipe } from './organization'

export const Pipes = [
  AbsoluteValuePipe,
  AccountTypePipe,
  DataPointMissingAlertHint,
  DataPointMissingNotificationHintPipe,
  DataThresholdAlertHintPipe,
  DataThresholdNotificationHintPipe,
  DataTypeNamePipe,
  CapitalizePipe,
  CcrBinaryPipe,
  CcrKilobytesPipe,
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
  OrganizationNamePipe,
  UnitConversionPipe,
  UnitConvertFromReadablePipe,
  UnitConvertToReadablePipe,
  UnitLabelPipe
]
