import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [joined, setJoined] = useState(false);
  const [wsReady, setWsReady] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const roomRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000');
    wsRef.current = ws;

    ws.onopen = () => {
      setWsReady(true);
      console.log('WebSocket connected');
    };

    ws.onclose = () => {
      setWsReady(false);
      setJoined(false);
      setLogs(prev => [...prev, '❌ Disconnected from server']);
      console.log('WebSocket disconnected');
    };

    ws.onerror = () => {
      setWsReady(false);
      setJoined(false);
      setLogs(prev => [...prev, '❌ WebSocket connection error']);
    };

     ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);

    if (data.type === 'message') {
      // Message from another user
      setLogs(prev => [...prev, `👤 ${data.content}`]);
    } 
  else if (data.type == 'join') {
      setLogs(prev => [...prev, "ℹ️ New user joined"]);
  }
  else if (data.type == 'leave') {
      setLogs(prev => [...prev, "ℹ️ A User left"]);
    }
  else {
      setLogs(prev => [...prev, event.data]);
    }
  } catch {
    setLogs(prev => [...prev, event.data]);
  }
};


    return () => {
      ws.close();
    };
  }, []);

  const log = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  const joinRoom = () => {
    if (!room.trim()) return;
    if (!wsReady || !wsRef.current) {
      log('❌ Cannot join: Not connected to server');
      return;
    }
    wsRef.current.send(JSON.stringify({ type: 'join', room }));
    setJoined(true);
    log(`🟢 Joined room: ${room}`);
  };

  const leaveRoom = () => {
    if (!room.trim() || !wsReady || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: 'leave', room }));
    log(`🔴 Left room: ${room}`);
    setJoined(false);
    setRoom('');
  };

  const sendMessage = () => {
    if (!message.trim() || !joined || !wsReady || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: 'message', room, content: message }));
    log(`🫵 You: ${message}`);
    setMessage('');
  };

  return (
    <div className="app-main">
      <aside className="sidebar">
        <h2>Room</h2>
        <input
          ref={roomRef}
          className="input room-input"
          type="text"
          placeholder="Room name"
          value={room}
          disabled={joined}
          onChange={e => setRoom(e.target.value)}
        />
        <button className="btn join-btn" onClick={joinRoom} disabled={joined || !room.trim() || !wsReady}>
          Join
        </button>
        <button className="btn leave-btn" onClick={leaveRoom} disabled={!joined || !wsReady}>
          Leave
        </button>
        <div className={`status ${wsReady ? (joined ? 'online' : 'offline') : 'offline'}`}>
          {wsReady ? (joined ? '🟢 Joined' : '🔴 Not in room') : '❌ Disconnected'}
        </div>
      </aside>
      <section className="chat-section">
        <header>
          <h1>Room Chat</h1>
          <span className="room-label">{room ? `Room: ${room}` : 'No room joined'}</span>
        </header>
        <div className="logs">
          {logs.length === 0 && <div className="log-entry empty">No messages yet.</div>}
          {logs.map((msg, i) => (
            <div key={i} className={`log-entry${msg.startsWith('🫵 You:') ? ' self' : ''}`}>
              {msg}
            </div>
          ))}
        </div>
        <div className="message-input-wrapper">
          <input
            className="input"
            type="text"
            placeholder={wsReady ? (joined ? "Type a message" : "Join a room to chat") : "Not connected"}
            value={message}
            disabled={!joined || !wsReady}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button className="btn send-btn" onClick={sendMessage} disabled={!joined || !message.trim() || !wsReady}>
            Send
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;
