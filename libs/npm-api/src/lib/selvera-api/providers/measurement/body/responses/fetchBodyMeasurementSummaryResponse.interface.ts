/**
 * Interface for GET /measurement/body summary response
 */

export interface FetchBodyMeasurementSummaryResponse {
  weightMin: number
  weightMax: number
  weightAverage: number
  fatFreeMassMin: number
  fatFreeMassMax: number
  fatFreeMassAverage: number
  bodyFatMin: number
  bodyFatMax: number
  bodyFatAverage: number
  fatMassWeightMin: number
  fatMassWeightMax: number
  fatMassWeightAverage: number
  bloodPressureDiastolicMin: number
  bloodPressureDiastolicMax: number
  bloodPressureDiastolicAverage: number
  bloodPressureSystolicMin: number
  bloodPressureSystolicMax: number
  bloodPressureSystolicAverage: number
  heartRateMin: number
  heartRateMax: number
  heartRateAverage: number
  bloodOxygenLevelMin: number
  bloodOxygenLevelMax: number
  bloodOxygenLevelAverage: number
  boneWeightMin: number
  boneWeightMax: number
  boneWeightAverage: number
  basalMetabolicRateMin: number
  basalMetabolicRateMax: number
  basalMetabolicRateAverage: number
  musclePercentageMin: number
  musclePercentageMax: number
  musclePercentageAverage: number
  visceralFatPercentageMin: number
  visceralFatPercentageMax: number
  visceralFatPercentageAverage: number
  waterPercentageMin: number
  waterPercentageMax: number
  waterPercentageAverage: number
  waistMin: number
  waistMax: number
  waistAverage: number
  armMin: number
  armMax: number
  armAverage: number
  hipMin: number
  hipMax: number
  hipAverage: number
  chestMin: number
  chestMax: number
  chestAverage: number
  thighMin: number
  thighMax: number
  thighAverage: number
  neckMin: number
  neckMax: number
  neckAverage: number
  thoraxMin: number
  thoraxMax: number
  thoraxAverage: number
  totalCholesterolMin: number
  totalCholesterolMax: number
  totalCholesterolAverage: number
  ldlMin: number
  ldlMax: number
  ldlAverage: number
  hdlMin: number
  hdlMax: number
  hdlAverage: number
  vldlMin: number
  vldlMax: number
  vldlAverage: number
  triglyceridesMin: number
  triglyceridesMax: number
  triglyceridesAverage: number
  fastingGlucoseMin: number
  fastingGlucoseMax: number
  fastingGlucoseAverage: number
  hba1cMin: number
  hba1cMax: number
  hba1cAverage: number
  insulinMin: number
  insulinMax: number
  insulinAverage: number
  hsCrpMin: number
  hsCrpMax: number
  hsCrpAverage: number
  acetonePpmMin: number
  acetonePpmMax: number
  acetonePpmAverage: number
  temperatureMin: number
  temperatureMax: number
  temperatureAverage: number
  respirationRateMin: number
  respirationRateMax: number
  respirationRateAverage: number
  skeletalMuscleMassMin: number
  skeletalMuscleMassMax: number
  skeletalMuscleMassAverage: number
  totalBodyWaterMin: number
  totalBodyWaterMax: number
  totalBodyWaterAverage: number
  extracellularWaterToBodyWaterMin: number
  extracellularWaterToBodyWaterMax: number
  extracellularWaterToBodyWaterAverage: number
  leftArmMassMin: number
  leftArmMassMax: number
  leftArmMassAverage: number
  rightArmMassMin: number
  rightArmMassMax: number
  rightArmMassAverage: number
  leftLegMassMin: number
  leftLegMassMax: number
  leftLegMassAverage: number
  rightLegMassMin: number
  rightLegMassMax: number
  rightLegMassAverage: number
  torsoMassMin: number
  torsoMassMax: number
  torsoMassAverage: number
  phaseAngleMin: number
  phaseAngleMax: number
  phaseAngleAverage: number
  visceralFatMassMin: number
  visceralFatMassMax: number
  visceralFatMassAverage: number
  visceralAdiposeTissueMin: number
  visceralAdiposeTissueMax: number
  visceralAdiposeTissueAverage: number
  visceralFatTanitaMin: number
  visceralFatTanitaMax: number
  visceralFatTanitaAverage: number
  bmiMin: number
  bmiMax: number
  bmiAverage: number
  previousWeight: number
  previousBMI: number
  previousBodyFat: number
  oldestWeight: number
  oldestRecord: string
  ketonesMin: number
  ketonesMax: number
  ketonesAverage: number
}
