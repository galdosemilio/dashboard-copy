export interface CreateManualInteractionRequest {
    /**
     * Billable service for the manual interaction.
     * If the billable service is set to RPM (1), extra restrictions apply - the interaction has to be in the current calendar month.
     */
    billableService?: string;
    organization: string;
    participants: string[];
    range: {
        end: string;
        start: string;
    };
    type: string;
}
