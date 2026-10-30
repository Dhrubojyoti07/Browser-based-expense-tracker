import http from 'http';
import { PORT } from './src/config/env.js';
import app from './src/app.js';
import { setupWebSocket } from './src/services/websocket.js';

// Create an HTTP server from the Express app so WebSocket can share the same port
const server = http.createServer(app);

// Attach the WebSocket service to the HTTP server
setupWebSocket(server);

// Start listening
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket available on ws://localhost:${PORT}`);
});