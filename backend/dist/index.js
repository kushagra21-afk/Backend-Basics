"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8000 });
const rooms = new Map();
const socketRoom = new WeakMap();
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (data) => {
        try {
            const message = typeof data === 'string' ? data : data.toString();
            const parsedMsg = JSON.parse(message);
            if (parsedMsg.type === 'join') {
                const room = parsedMsg.room;
                if (!rooms.has(room)) {
                    rooms.set(room, []);
                }
                const sockets = rooms.get(room);
                if (!sockets.includes(ws)) {
                    sockets.push(ws);
                    socketRoom.set(ws, room);
                    ws.send(`Joined room: ${room}`);
                }
            }
            else if (parsedMsg.type === 'leave') {
                const room = parsedMsg.room;
                if (rooms.has(room)) {
                    const roomSockets = rooms.get(room);
                    if (roomSockets) {
                        rooms.set(room, roomSockets.filter((socket) => socket !== ws));
                        ws.send(`Left room: ${room}`);
                    }
                }
            }
            // Broadcast to all connected sockets
            const room = socketRoom.get(ws);
            if (room && parsedMsg.room) {
                const roomSockets = rooms.get(parsedMsg.room);
                if (roomSockets) {
                    roomSockets.forEach((socket) => {
                        if (socket !== ws && socket.readyState === ws_1.WebSocket.OPEN) {
                            socket.send(JSON.stringify(parsedMsg));
                        }
                    });
                }
            }
        }
        catch (err) {
            console.error('Failed to process message:', err);
            ws.send('Invalid message format');
        }
    });
    ws.on('close', () => {
        const room = socketRoom.get(ws);
        if (room && rooms.has(room)) {
            rooms.set(room, rooms.get(room).filter((socket) => socket !== ws));
        }
        socketRoom.delete(ws);
    });
});
