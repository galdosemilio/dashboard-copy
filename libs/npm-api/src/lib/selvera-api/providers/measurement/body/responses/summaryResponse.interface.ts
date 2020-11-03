/**
 * Interface for single day|week|month of data for body summary section
 */

export interface SummaryResponse {
    oldestRecord?: string;
    oldestWeight?: number;
    previousSleepEnd?: string;
    previousSleepStart?: string;
    previousBMI?: number;
    previousBodyFat?: number;
    previousWeight?: number;

    acetonePpmAverage?: number;
    acetonePpmMax?: number;
    acetonePpmMin?: number;
    armAverage?: number;
    armMax?: number;
    armMin?: number;
    basalMetabolicRateAverage?: number;
    basalMetabolicRateMax?: number;
    basalMetabolicRateMin?: number;
    bloodOxygenLevelAverage?: number;
    bloodOxygenLevelMax?: number;
    bloodOxygenLevelMin?: number;
    bloodPressureDiastolicAverage?: number;
    bloodPressureDiastolicMax?: number;
    bloodPressureDiastolicMin?: number;
    bloodPressureSystolicAverage?: number;
    bloodPressureSystolicMax?: number;
    bloodPressureSystolicMin?: number;
    bmiAverage?: number;
    bmiMax?: number;
    bmiMin?: number;
    bodyFatAverage?: number;
    bodyFatMax?: number;
    bodyFatMin?: number;
    boneWeightAverage?: number;
    boneWeightMax?: number;
    boneWeightMin?: number;
    caloriesAverage?: number;
    caloriesMax?: number;
    caloriesMin?: number;
    chestAverage?: number;
    chestMax?: number;
    chestMin?: number;
    distanceAverage?: number;
    distanceMax?: number;
    distanceMin?: number;
    fastingGlucoseAverage?: number;
    fastingGlucoseMax?: number;
    fastingGlucoseMin?: number;
    fatFreeMassAverage?: number;
    fatFreeMassMax?: number;
    fatFreeMassMin?: number;
    fatMassWeightAverage?: number;
    fatMassWeightMax?: number;
    fatMassWeightMin?: number;
    hba1cAverage?: number;
    hba1cMax?: number;
    hba1cMin?: number;
    hdlAverage?: number;
    hdlMax?: number;
    hdlMin?: number;
    heartRateAverage?: number;
    heartRateMax?: number;
    heartRateMin?: number;
    hsCrpAverage?: number;
    hsCrpMax?: number;
    hsCrpMin?: number;
    ldlAverage?: number;
    ldlMax?: number;
    ldlMin?: number;
    musclePercentageAverage?: number;
    musclePercentageMax?: number;
    musclePercentageMin?: number;
    hipAverage?: number;
    hipMax?: number;
    hipMin?: number;
    insulinAverage?: number;
    insulinMax?: number;
    insulinMin?: number;
    neckAverage?: number;
    neckMax?: number;
    neckMin?: number;
    sleepMinutesAverage?: number;
    sleepMinutesMax?: number;
    sleepMinutesMin?: number;
    sleepQualityAverage?: number;
    stepsAverage?: number;
    stepsMax?: number;
    stepsMin?: number;
    temperatureMin?: number;
    temperatureMax?: number;
    temperatureAverage?: number;
    respirationRateMin?: number;
    respirationRateMax?: number;
    respirationRateAverage?: number;
    thighAverage?: number;
    thighMax?: number;
    thighMin?: number;
    thoraxAverage?: number;
    thoraxMax?: number;
    thoraxMin?: number;
    totalCholesterolAverage?: number;
    totalCholesterolMax?: number;
    totalCholesterolMin?: number;
    triglyceridesAverage?: number;
    triglyceridesMax?: number;
    triglyceridesMin?: number;
    vldlAverage?: number;
    vldlMax?: number;
    vldlMin?: number;
    visceralFatPercentageAverage?: number;
    visceralFatPercentageMax?: number;
    visceralFatPercentageMin?: number;
    waistAverage?: number;
    waistMax?: number;
    waistMin?: number;
    waterPercentageAverage?: number;
    waterPercentageMax?: number;
    waterPercentageMin?: number;
    weightAverage?: number;
    weightMax?: number;
    weightMin?: number;
    visceralFatTanitaAverage?: number;
    visceralFatTanitaMax?: number;
    visceralFatTanitaMin?: number;
}
