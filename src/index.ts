import { WebSocket, WebSocketServer } from 'ws';
import { createServer } from 'http';
const wss = new WebSocketServer({ port: 8080 });

let allSockets: WebSocket[] = [];
wss.on('connection', (ws) => {
  allSockets.push(ws);
  console.log('Client connected');
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    allSockets.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(`Broadcast: ${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    allSockets = allSockets.filter((socket) => socket !== ws);
  });
});