import { useState, useEffect, useRef, useCallback } from 'react';
import { WS_URL } from '../utils/constants';

const MAX_RECONNECT_ATTEMPTS = 5;

/**
 * Custom hook for WebSocket connection with graceful fallback.
 * @param {string|null} token - JWT token for authentication
 * @returns {{ lastMessage: object|null, isConnected: boolean }}
 */
export default function useWebSocket(token) {
  const [lastMessage, setLastMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const attemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (!token) return;

    if (attemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      // In serverless environments (e.g. Vercel), WebSocket may not be supported
      return;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // ignore
      }
    }

    try {
      const ws = new WebSocket(`${WS_URL}?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        attemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch {
          // parse error ignored
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        attemptsRef.current += 1;
        if (attemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };

      ws.onerror = () => {
        try {
          ws.close();
        } catch {
          // ignore
        }
      };
    } catch {
      // Connection initialization failed
      attemptsRef.current += 1;
    }
  }, [token]);

  useEffect(() => {
    attemptsRef.current = 0;
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, [connect]);

  return { lastMessage, isConnected };
}