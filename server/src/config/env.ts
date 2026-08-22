import "dotenv/config";

const getEnvVar = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

export const env = {
    port: process.env.PORT ?? "3000",
    mongodbCnn: getEnvVar("MONGODB_CNN"),
    secretOrPrivateKey: getEnvVar("SECRET_OR_PRIVATE_KEY")
};
