export interface KeyManagementEventPayload {
  apiKey: string;
  rateLimitPerMinute?: number;
  expiresAt?: string; // Or Date if parsed
  isActive?: boolean;
}

export interface KeyManagementEvent {
  eventType: "CREATED" | "UPDATED" | "DELETED" | "DISABLED" | "ENABLED";
  payload: KeyManagementEventPayload;
}