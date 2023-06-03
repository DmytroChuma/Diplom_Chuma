require('dotenv').config();
const config = {
    PORT: process.env.PORT || '3001',
    SESSION_KEY: process.env.SESSION_KEY || 'development_test_key',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_NAME: process.env.DB_NAME || '',
    DB_PASSWORD: process.env.DB_PASSWORD || ''
}

module.exports = config;