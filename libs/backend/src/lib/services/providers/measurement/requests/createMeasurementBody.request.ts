/**
 * POST /measurement/body/
 */

export interface CreateMeasurementBodyRequest {
  /** The account ID of the client to add the measurement for. Optional for Client requests, otherwise required. */
  account?: string;
  /** The date and time this measurement was taken in ISO8601 format. */
  recordedAt: string;
  /** The id of the device type. */
  device: number;
  /** The height of the client in cm. */
  height?: number;
  /** The weight of the client in grams. */
  weight?: number;
  /** The weight of fat free mass in grams. */
  fatFreeMass?: number;
  /** Body fat percent out of 100,000 units.  For example, 37.23% would be stored as 37230. */
  bodyFat?: number;
  /** The weight of the fat mass in grams. */
  fatMassWeight?: number;
  /** Diastolic blood pressure. */
  bloodPressureDiastolic?: number;
  /** Systolic blood pressure. */
  bloodPressureSystolic?: number;
  /** Pulse. */
  heartRate?: number;
  /** Percent out of 100,000 units.  For example, 98.23% would be stored 98230. */
  bloodOxygenLevel?: number;
  /** Weight of the bones in grams. */
  boneWeight?: number;
  /** Basal metabolic rate in kcal/day. */
  basalMetabolicRate?: number;
  /** Percentage of weight that is muscle, stored out of 100,000 units.  For example, 37.23% would be stored as 37230. */
  musclePercentage?: number;
  /** Visceral fat percentage, stored out of 100,000 units.  For example, 37.23% would be stored as 37230. */
  visceralFatPercentage?: number;
  /** Water/hydration percentage, stored out of 100,000 units.  For example, 37.23% would be stored as 37230. */
  waterPercentage?: number;
  /** Waist measurement, stored as mm. For example, 50 cm would be stored as 500. */
  waist?: number;
  /** Arm measurement, stored as mm. For example, 50 cm would be stored as 500. */
  arm?: number;
  /** Hip measurement, stored as mm. For example, 250 cm would be stored as 2500. */
  hip?: number;
  /** Chest measurement, stored as mm. For example, 250 inch would be stored as 6350. */
  chest?: number;
  /** Thigh measurement, stored as mm. For example, 150 inch would be stored as 3810. */
  thigh?: number;
  /** Neck measurement, stored as mm. For example, 100 inch would be stored as 2540. */
  neck?: number;
  /** Thorax measurement, stored as mm. For example, 50 inch would be stored as 1270. */
  thorax?: number;
  /** Total cholesterol measurement, saved in mg/dl. */
  totalCholesterol?: number;
  /** Low-density lipoprotein level (LDL) measurement, saved in mg/dl. */
  ldl?: number;
  /** High-density lipoprotein level (HDL) measurement, saved in mg/dl. */
  hdl?: number;
  /** Very-low-density lipoprotein level (VLDL) measurement, saved in mg/dl. */
  vldl?: number;
  /** Triglycerides measurement, saved in mg/dl. */
  triglycerides?: number;
  /** Fasting glucose measurement, saved in mg/dl. */
  fastingGlucose?: number;
  /**
   * Glycated hemoglobin (hemoglobin A1c) percentage level measurement, out of 100,000 units. For example, 5.
   * 5% would be stored as 5500.
   */
  hba1c?: number;
  /** Insulin measurement, saved in uU/ml. */
  insulin?: number;
  /**
   * High-sensitivity C-reactive protein (hs-CRP) fractional level Thorax measurement, where 10,000 units is 1 mg/l.
   * For example, 5.5 mg/l would be stored as 5500.
   */
  hsCrp?: number;
}
