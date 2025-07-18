README - WebSocket Chat Server

This project is a lightweight WebSocket server built with Node.js using the 'ws' library. It allows clients to join chat rooms and send messages in real-time.

--------------------
FEATURES:
- WebSocket-based real-time communication
- Room-based messaging (join any room)
- Broadcast messages to all users in a room
- Simple client interaction format (JSON)

--------------------
TECH STACK:
- Node.js
- ws (WebSocket)
- React

--------------------
INSTALLATION:

1. Clone the repo:
   git clone https://github.com/kushagra21-afk/websocket-chat-server.git
   cd websocket-chat-server

2. Install dependencies:
   npm install

3. Run the server:
   node index.js

--------------------
USAGE (Client Example):

- Use any WebSocket client (browser, Postman, or custom frontend)
- Connect to: ws://localhost:8080

Send JSON messages:

1. Join a room:
   {"type":"join", "room":"bruh"}

2. Send a message:
   {"type":"message", "room":"bruh", "content":"hi"}

--------------------
SERVER LOGIC:

- Maintains a `Map` of rooms to connected clients
- When a user joins, their WebSocket is added to the room
- On receiving a message, it broadcasts to all clients in that room

Line: rooms.get(room)!.push(ws);
→ Adds the WebSocket connection to the room’s array

--------------------
DEPLOYMENT:

- Can be run locally or deployed using Docker/Render
- Ensure port 8080 is exposed and allowed

--------------------
LICENSE:
MIT License © 2025 Kushagra Singhal
