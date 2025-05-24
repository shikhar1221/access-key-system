export enum AccessKeyEventType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  DISABLED = 'DISABLED',
  ENABLED = 'ENABLED', // Added ENABLED event type
}

export interface AccessKeyEvent {
  eventType: AccessKeyEventType;
  payload: Partial<{
    id: string;
    userId: string;
    apiKey: string;
    rateLimitPerMinute: number;
    expiresAt: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  timestamp: Date;
}