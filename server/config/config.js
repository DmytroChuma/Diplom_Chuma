require('dotenv').config();
const config = {
    PORT: process.env.PORT || '3001',
    SESSION_KEY: process.env.SESSION_KEY || 'development_test_key',
    DB_HOST: process.env.DB_HOST || 'sql11.freemysqlhosting.net',
    DB_USER: process.env.DB_USER || 'sql11653781',
    DB_NAME: process.env.DB_NAME || 'sql11653781',
    DB_PASSWORD: process.env.DB_PASSWORD || 'tuBFeRJxPh'
}

module.exports = config;