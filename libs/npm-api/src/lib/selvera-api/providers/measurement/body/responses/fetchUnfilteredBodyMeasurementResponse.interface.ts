/**
 * Interface for GET /measurement/body (response)
 */

export interface FetchUnfilteredBodyMeasurementResponse {
  id: string
  user_id: number
  recorded_at: string
  source: string

  weight: number | null
  fat_free_mass: number | null
  body_fat: number | null
  fat_mass_weight: number | null
  blood_pressure_diastolic: number | null
  blood_pressure_systolic: number | null
  heart_rate: number | null
  blood_oxygen_level: number | null
  bone_weight: number | null
  basal_metabolic_rate: number | null
  muscle_percentage: number | null
  visceral_fat_percentage: number | null
  water_percentage: number | null
  waist: number | null
  arm: number | null
  hip: number | null
  chest: number | null
  thigh: number | null
  neck: number | null
  thorax: number | null
  total_cholesterol: number | null
  ldl: number | null
  hdl: number | null
  vldl: number | null
  triglycerides: number | null
  fasting_glucose: number | null
  hba1c: number | null
  insulin: number | null
  hs_crp: number | null
  acetone_ppm: number | null
  temperature: number | null
  respiration_rate: number | null
  bmi: number | null
  visceral_fat_tanita: number | null
}
