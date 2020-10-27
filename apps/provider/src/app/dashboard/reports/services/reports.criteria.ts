export type ReportsTimeframe = 'month' | 'day';

export type WeightChangeOrder = 'percentage' | 'value' | 'provider' | 'name';
export type SleepChangeOrder =
  | 'hourSum'
  | 'hourMin'
  | 'hourMax'
  | 'hourAvg'
  | 'provider'
  | 'name';
export type SortDirection = 'asc' | 'desc';

export interface ReportsCriteria {
  organization?: string;
  startDate?: string;
  endDate?: string;
  unit?: string;
  sort?: any;
  limit?: any;
  // control util
  diff?: number;
}
