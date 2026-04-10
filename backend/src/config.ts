export const config = {
    jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/soberguard',
    port: process.env.PORT || 3000
};
