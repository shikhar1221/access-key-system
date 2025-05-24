export declare class CreateAccessKeyDto {
    userId: string;
    rateLimitPerMinute: number;
    expiresAt: string;
    isActive?: boolean;
}
