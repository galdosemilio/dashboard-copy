export interface ConsultationCreateRequest {
    clientId: string;
    consultationDate: string;
    startTime?: string;
    endTime?: string;
    internalNote: string;
    externalNote?: string;
    activityNote?: string;
    nutritionNote?: string;
    behaviorNote?: string;
    type: 'public' | 'private';
}
