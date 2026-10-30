import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Resolve paths relative to the backend root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKEND_ROOT = path.resolve(__dirname, '..', '..');

// On Vercel serverless functions, only /tmp is writable; locally use backend/data
const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(BACKEND_ROOT, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

/**
 * Ensure the data directory and users.json file exist.
 * Auto-creates both on first run.
 */
const ensureDataFile = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
};

/**
 * Read all users from the JSON file.
 * @returns {Array} Array of user objects.
 */
const readUsers = () => {
  ensureDataFile();
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

/**
 * Write the full users array back to the JSON file.
 * @param {Array} users - The users array to persist.
 */
const writeUsers = (users) => {
  ensureDataFile();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
};

/**
 * User model — file-based JSON storage.
 * Provides static-style methods for finding and creating users.
 */
const User = {
  /**
   * Find a user by email address.
   * @param {string} email
   * @returns {Object|null} The user object or null if not found.
   */
  findByEmail(email) {
    const users = readUsers();
    return users.find((u) => u.email === email) || null;
  },

  /**
   * Find a user by their unique ID.
   * @param {string} id
   * @returns {Object|null} The user object or null if not found.
   */
  findById(id) {
    const users = readUsers();
    return users.find((u) => u.id === id) || null;
  },

  /**
   * Create a new user and persist to disk.
   * Password should already be hashed before calling this method.
   * @param {Object} param0 - { name, email, password }
   * @returns {Object} The newly created user object.
   */
  create({ name, email, password }) {
    const users = readUsers();
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password, // Already hashed by the controller
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeUsers(users);
    return newUser;
  },
};

export default User;