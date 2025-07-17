import { WebSocket, WebSocketServer } from 'ws';
import { createServer } from 'http';


const wss = new WebSocketServer({ port: 8080 });

const rooms = new Map<string, WebSocket[]>();

let allSockets: WebSocket[] = [];
wss.on('connection', (ws) => {
  allSockets.push(ws);
  console.log('Client connected');
  ws.on('message', (message: string) => {
    let parsedmsg = JSON.parse(message)
    if (parsedmsg.type === 'join') {
      const room = parsedmsg.room;
      if (!rooms.has(room)) {
        rooms.set(room, []);
      }
      rooms.get(room)?.push(ws);
      ws.send(`Joined room: ${room}`);
    } else if (parsedmsg.type === 'leave') {
      const room = parsedmsg.room;
      if (rooms.has(room)) {
        const roomSockets = rooms.get(room);
        if (roomSockets) {
          rooms.set(room, roomSockets.filter((socket) => socket !== ws));
          ws.send(`Left room: ${room}`);
        }
      }}
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