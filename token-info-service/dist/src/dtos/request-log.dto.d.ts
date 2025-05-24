export declare class CreateRequestLogDto {
    apiKey: string;
    requestPath: string;
    isRateLimited?: boolean;
    isSuccessful?: boolean;
    errorMessage?: string;
}
export declare class RequestLogDto {
    id: string;
    apiKey: string;
    timestamp: string;
    requestPath: string;
    isRateLimited: boolean;
    isSuccessful: boolean;
    errorMessage?: string;
}
