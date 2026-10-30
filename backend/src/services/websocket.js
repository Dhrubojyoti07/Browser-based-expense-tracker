import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

/**
 * Map of userId -> Set of active WebSocket connections.
 * Used to broadcast expense events to all tabs/devices of a user.
 */
const userConnections = new Map();

/**
 * Attach a WebSocket server to the existing HTTP server.
 * Clients authenticate by passing a JWT token as a query parameter:
 *   ws://localhost:3001?token=<jwt>
 *
 * @param {import('http').Server} server - The HTTP server instance.
 */
export const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    // Extract token from query string
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(4001, 'Authentication required');
      return;
    }

    // Verify the JWT
    const secret = JWT_SECRET || 'expense-tracker-jwt-secret-key-2024';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      ws.close(4002, 'Invalid token');
      return;
    }

    const userId = decoded.id;

    // Store the connection, grouped by userId
    if (!userConnections.has(userId)) {
      userConnections.set(userId, new Set());
    }
    userConnections.get(userId).add(ws);

    // Clean up on disconnect
    ws.on('close', () => {
      const connections = userConnections.get(userId);
      if (connections) {
        connections.delete(ws);
        if (connections.size === 0) {
          userConnections.delete(userId);
        }
      }
    });

    // Handle unexpected errors to prevent crashes
    ws.on('error', () => {
      ws.close();
    });
  });

  return wss;
};

/**
 * Broadcast an event to every active WebSocket connection belonging to a user.
 *
 * @param {string} userId - The user whose clients should receive the message.
 * @param {string} event  - Event name, e.g. "expense:created" or "expense:deleted".
 * @param {Object} data   - Payload to send alongside the event.
 */
export const broadcast = (userId, event, data) => {
  const connections = userConnections.get(userId);
  if (!connections) return;

  const message = JSON.stringify({ event, data });

  for (const ws of connections) {
    if (ws.readyState === ws.OPEN) {
      ws.send(message);
    }
  }
};