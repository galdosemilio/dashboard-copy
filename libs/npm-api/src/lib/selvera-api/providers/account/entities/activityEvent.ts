export interface AccountActivityInstant {
    instant: string;
}

export interface AccountActivityTimeRange {
    end: string;
    start: string;
}

export interface AccountActivityEvent {
    account?: string;
    interaction: { time: AccountActivityInstant | AccountActivityTimeRange };
    organization: string;
    tags: string[];
    source: 'dashboard' | 'mobile';
}
