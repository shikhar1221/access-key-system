export interface KeyManagementEventPayload {
    apiKey: string;
    rateLimitPerMinute?: number;
    expiresAt?: string;
    isActive?: boolean;
}
export interface KeyManagementEvent {
    eventType: "CREATED" | "UPDATED" | "DELETED" | "DISABLED" | "ENABLED";
    payload: KeyManagementEventPayload;
}
