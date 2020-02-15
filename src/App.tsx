import React, { useState } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [ws, setWs] = useState();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [myMessageInput, setMyMessageInput] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [exceptionMessage, setExceptionMessage] = useState<string>('');


  const onClickConnect = () => {
    const socket = io('http://localhost:3001');
    socket.on('connect', () => {
      setIsConnected(true);
    });
    socket.on('message', (data: any) => {
      setMessages([...messages, data]);
    });
    socket.on('exception', (data: any) => {
      setExceptionMessage(data);
    });
    socket.on('disconnect', () => {
      setExceptionMessage('Disconnected');
    });
    setWs(socket);
  }

  const onChangeMessage = ({target: {value}}: any) => setMyMessageInput(value);
  const onClickSendMessage = () => {
    ws.emit('message', myMessageInput, 
    // (response: string) => {
    //   console.log(response);
    // }
    );
    setMessages([...messages, myMessageInput]);
  };

  return (
    <div className="App">
      {!isConnected && <button onClick={onClickConnect}>connect</button>}
      {exceptionMessage}
      {isConnected &&
        <>
          <input type="text" value={myMessageInput} onChange={onChangeMessage}/>
          <button onClick={onClickSendMessage}>send</button>
          <div>
            {messages.map((message, index) => <div key={index}>{message}</div>)}
          </div>
        </>
      }
    </div>
  );
}

export default App;
