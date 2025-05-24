export declare class CreateDuplicatedAccessKeyDto {
    apiKey: string;
    rateLimitPerMinute: number;
    expiresAt: string;
    isActive?: boolean;
}
export declare class UpdateDuplicatedAccessKeyDto {
    rateLimitPerMinute?: number;
    expiresAt?: string;
    isActive?: boolean;
}
