/**
 * Interface for single day|week|month of data for body summary section
 */

export interface SummaryDataResponseSegment {
    date: string;
    id?: string;

    acetonePpm?: number;
    weight?: number;
    bmi?: number;
    fatFreeMass?: number;
    bodyFat?: number;
    fatMassWeight?: number;
    bloodPressureDiastolic?: number;
    bloodPressureSystolic?: number;
    heartRate?: number;
    bloodOxygenLevel?: number;
    boneWeight?: number;
    basalMetabolicRate?: number;
    musclePercentage?: number;
    visceralFatPercentage?: number;
    waterPercentage?: number;
    waist?: number;
    arm?: number;
    hip?: number;
    chest?: number;
    thigh?: number;
    neck?: number;
    thorax?: number;
    totalCholesterol?: number;
    ldl?: number;
    hdl?: number;
    vldl?: number;
    triglycerides?: number;
    fastingGlucose?: number;
    hba1c?: number;
    insulin?: number;
    hsCrp?: number;
    temperature?: number;
    respirationRate?: number;
    visceralFatTanita?: number;
}
