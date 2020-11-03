export interface PackagePriceItem {
  id: string;
  lastStepMessage?: string;
  name: string;
  billing: PackagePricePlanItem[];
  targetParentOrg: string;
  type: 'track' | 'virtualHealth' | 'remoteMonitoring' | 'healthSystem';
}

export interface PackagePricePlanItem {
  billingPeriod: 'monthly' | 'annually';
  id: string;
  name: string;
  price?: number;
}
