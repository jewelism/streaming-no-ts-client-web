import React, { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const submitButtonEl = useRef(null);
  const [ws, setWs] = useState();
  // const [rooms, setRooms] = useState<string[]>([]);
  const [rooms, setRooms] = useState<string[]>(['room1', 'room2', 'room3']);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [myMessageInput, setMyMessageInput] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [exceptionMessage, setExceptionMessage] = useState<string>('');


  const enterHandler = useCallback((e: any) => {
    if (e.code === 'Enter') {
      // DOM document.querySelector('button')?.click();
      // react js submitButtonEl.current?.click();
      // react ts
      (submitButtonEl.current as unknown as HTMLElement)?.click();
    }
  }, []);

  const onReceiveMessage = useCallback((message: string) => {
    setMessages(msgs => [...msgs, message]);
  }, []);

  const onClickConnect = useCallback(() => {
    const socket = io('http://boseok.iptime.org:3002/chat');
    
    socket.on('connect', () => {
      setIsConnected(true);
    });
    socket.on('message', onReceiveMessage);
    socket.on('exception', (data: any) => {
      setExceptionMessage(data);
    });
    socket.on('disconnect', () => {
      setExceptionMessage('Disconnected');
    });
    setWs(socket);
  }, [onReceiveMessage]);

  const onClickJoinRoom = useCallback((roomId) => {
    ws.emit('room', roomId);
    setSelectedRoom(roomId);
    setRooms([]);
  }, [ws])

  const onChangeMessage = useCallback(({ target: { value } }: any) => setMyMessageInput(value), []);
  const onClickSendMessage = useCallback(() => {
    ws.emit('message', { roomId: selectedRoom, message: myMessageInput },
      // (response: string) => {
      //   console.log(response);
      // }
    );
    setMessages(msgs => [...msgs, myMessageInput]);
    setMyMessageInput('');
  }, [ws, myMessageInput]);

  useEffect(() => {
    // fetch('~').then(res => res.json()).then(setRooms);
    document.addEventListener('keydown', enterHandler);
    return () => {
      document.removeEventListener('keydown', enterHandler);
    };
  });

  return (
    <div className="App">
      {!isConnected && <button type="submit" ref={submitButtonEl} onClick={onClickConnect}>connect</button>}
      <div>{exceptionMessage}</div>
      {selectedRoom && <div>roomId => {selectedRoom}</div>}
      {isConnected &&
        <>
          {!selectedRoom && rooms.map(roomId => <button type="button" key={roomId} onClick={() => onClickJoinRoom(roomId)}>join {roomId}</button>)}
          <input type="text" value={myMessageInput} onChange={onChangeMessage} />
          <button type="submit" ref={submitButtonEl} onClick={onClickSendMessage}>send</button>
          <div>
            {messages.map((message, index) => <div key={message + index}>{message}</div>)}
          </div>
        </>
      }
    </div>
  );
}

export default App;
