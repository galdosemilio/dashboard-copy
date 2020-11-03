/**
 * Interface for GET /build/status/${organization} (response)
 */

export interface FetchSingleStatusReponse {
    data: Array<any>;
}

export type PlatformType = 'android' | 'ios';

export interface PlatformAppData {
    lastUpdated: string;
    storeVersion: string;
}

export interface BuildInfo {
    platform: PlatformType;
    lastBuildDate: string;
    version: string;
    commit: string;
    buildState: string;
    platformAppData?: PlatformAppData;
}
