export interface ConsultationResponse {
    provider: string;
    providerName: string;
    client: string;
    clientName: string;
    internalNote: string;
    externalNote: string;
    activityNote: string;
    nutritionNote: string;
    behaviorNote: string;
    consultationMethod: string;
    startTime: string;
    endTime: string;
    consultationDate: string;
    consultationType: 'public' | 'private';
}
