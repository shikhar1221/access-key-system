export declare class RequestLog {
    id: string;
    apiKey: string;
    timestamp: Date;
    requestPath: string;
    isRateLimited: boolean;
    isSuccessful: boolean;
    errorMessage?: string;
}
