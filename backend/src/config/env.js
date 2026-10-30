import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load backend/.env based on file location
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'expense-tracker-jwt-secret-key-2024';
export const PORT = Number(process.env.PORT) || 3001;
export const NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  JWT_SECRET,
  PORT,
  NODE_ENV,
};