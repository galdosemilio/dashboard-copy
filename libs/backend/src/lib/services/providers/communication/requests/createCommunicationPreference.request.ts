export interface CreateCommunicationPreferenceRequest {
  isActive?: boolean;
  organization: string;
  videoConferencing: {
    isEnabled: boolean;
  };
}
