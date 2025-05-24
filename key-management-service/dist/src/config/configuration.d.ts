declare const _default: (() => {
    port: number;
    database: {
        type: string;
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
        synchronize: boolean;
        poolSize: number;
    };
    redis: {
        url: string;
    };
    DATABASE_URL: string;
    REDIS_URL: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    database: {
        type: string;
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
        synchronize: boolean;
        poolSize: number;
    };
    redis: {
        url: string;
    };
    DATABASE_URL: string;
    REDIS_URL: string;
}>;
export default _default;
