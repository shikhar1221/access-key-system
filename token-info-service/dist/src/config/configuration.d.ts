declare const _default: (() => {
    DATABASE_URL: string;
    REDIS_URL: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    DATABASE_URL: string;
    REDIS_URL: string;
}>;
export default _default;
