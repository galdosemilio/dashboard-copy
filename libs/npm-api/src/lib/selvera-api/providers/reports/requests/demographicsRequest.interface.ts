/**
 * Interface for GET /warehouse/demographics/*
 */

export interface DemographicsRequest {
    organization: string;
    date: string;
    mode?: 'simple' | 'detailed';
}
