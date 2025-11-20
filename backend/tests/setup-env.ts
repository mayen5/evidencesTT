// This runs BEFORE any modules are imported
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables with override
dotenv.config({
    path: path.join(__dirname, '../.env.test'),
    override: true
});
