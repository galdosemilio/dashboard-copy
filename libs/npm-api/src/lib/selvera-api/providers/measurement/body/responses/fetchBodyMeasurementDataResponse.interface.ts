/**
 * Interface for GET /measurement/body data response
 */

import { AccountRecord, DeviceRecord } from '../entities';

export interface FetchBodyMeasurementDataResponse {
    id: string;
    account: AccountRecord;
    device: DeviceRecord;
    recordedAt: string;
    updatedAt: string;
    weight: number;
    fatFreeMass: number;
    bodyFat: number;
    fatMassWeight: number;
    bloodPressureDiastolic: number;
    bloodPressureSystolic: number;
    heartRate: number;
    bloodOxygenLevel: number;
    boneWeight: number;
    basalMetabolicRate: number;
    musclePercentage: number;
    visceralFatPercentage: number;
    waterPercentage: number;
    waist: number;
    arm: number;
    hip: number;
    chest: number;
    thigh: number;
    neck: number;
    thorax: number;
    totalCholesterol: number;
    ldl: number;
    hdl: number;
    vldl: number;
    triglycerides: number;
    fastingGlucose: number;
    hba1c: number;
    insulin: number;
    acetonePpm: number;
    temperature: number;
    respirationRate: number;
    bmi: number;
    visceralFatTanita: number;
    hsCrp: number;
    skeletalMuscleMass: number;
    totalBodyWater: number;
    extracellularWaterToBodyWater: number;
    leftArmMass: number;
    rightArmMass: number;
    leftLegMass: number;
    rightLegMass: number;
    torsoMass: number;
    phaseAngle: number;
    visceralAdiposeTissue: number;
    visceralFatMass: number;
    ketones: number;
}
