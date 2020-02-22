import React, { useState, useCallback, useEffect } from 'react';
import io from 'socket.io-client';
import { IMember, IMessage, IRoom } from './types';
import Message from './components/Message';
import Room from './components/Room';
import Members from './components/Members';

const {
  REACT_APP_BASE_URL: BASE_URL,
  REACT_APP_API_PORT: API_PORT,
  REACT_APP_SOCKET_PORT: SOCKET_PORT
} = process.env;

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ws, setWs] = useState();
  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [members, setMembers] = useState<IMember[]>([]);
  const [myMessageInput, setMyMessageInput] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [exceptionMessage, setExceptionMessage] = useState<string>('');

  const socketId = ws?.id; //cant useMemo

  const addMessage = useCallback((message: IMessage) => setMessages(prevState => [...prevState, message]), []);
  const addNewMember = useCallback((newMember: IMember) => {
    console.log('newMember', newMember);
    setMembers(prev => {
      console.log('prev', prev);
      return [...prev, newMember]
    });
  }, []);
  const onClickConnect = useCallback(() => {
    setExceptionMessage('');
    const socket = io(`${BASE_URL}:${SOCKET_PORT}/chat`);
    socket.on('connect', () => {
      setIsConnected(true);
    });
    socket.on('message', addMessage);
    socket.on('newClient', addNewMember);
    socket.on('exception', (data: any) => {
      // console.log('exception data', data);
      setExceptionMessage('some server error !');
    });
    socket.on('disconnect', () => {
      setExceptionMessage('Disconnected !');
    });
    setWs(socket);
  }, [addMessage, addNewMember]);
  const onClickJoinRoom = useCallback((roomId, nickname) => {
    const room: IRoom = {
      socketId,
      roomId,
      nickname: nickname || socketId,
    };
    ws.emit('room', room, setMembers);
    setSelectedRoom(roomId);
    setRooms([]);
  }, [socketId, ws]);
  const onChangeMessage = useCallback((e: any) => {
    setMyMessageInput(e.target.value)
  }, []);
  const onClickSendMessage = useCallback(() => {
    ws.emit('message', {
      date: Date.now(),
      senderId: socketId,
      roomId: selectedRoom,
      text: myMessageInput
    });
    addMessage({ mine: true, senderId: '', date: Date.now(), text: myMessageInput });
    setMyMessageInput('');
  }, [ws, socketId, selectedRoom, myMessageInput, addMessage]);
  const handleEnter = useCallback(
    e => {
      if (!isSubmitting && myMessageInput) {
        if (e.key === "Enter") {
          onClickSendMessage();
          setIsSubmitting(s => !s);
          setTimeout(() => {
            setIsSubmitting(s => !s);
            setMyMessageInput("");
          }, 100);
        }
      }
    },
    [isSubmitting, myMessageInput, onClickSendMessage]
  );
  const onClickDisconnect = useCallback(() => {
    setSelectedRoom('');
    setIsConnected(false);
    ws?.close?.();
  }, [ws]);

  useEffect(() => {
    fetch(`${BASE_URL}:${API_PORT}/chat/rooms`).then(res => res.json()).then(setRooms);
  }, []);

  useEffect(() => {
    return () => {
      onClickDisconnect();
    };
  }, [onClickDisconnect, ws]);

  return (
    <div className="App">
      <div>{exceptionMessage}</div>
      {isConnected ?
        <>
          {selectedRoom ?
            <>
              <div>roomId => {selectedRoom}</div>
              <button type="button" onClick={onClickDisconnect}>disconnect</button>
              <Members members={members} />
              <Message members={members} messages={messages} />
              <MessageForm value={myMessageInput} onChange={onChangeMessage} onKeyDown={handleEnter} onClickSubmit={onClickSendMessage} />
            </>
            :
            <Room rooms={rooms} onClickJoin={onClickJoinRoom} />
          }
        </>
        :
        <button type="submit" onClick={onClickConnect}>connect</button>
      }
    </div>
  );
}

function MessageForm({ value, onChange, onKeyDown, onClickSubmit }
  : { value: string, onChange: any, onKeyDown: any, onClickSubmit: any }
) {
  return (
    <div>
      <input type="text" value={value} onChange={onChange} onKeyDown={onKeyDown} />
      <button type="button" onClick={onClickSubmit}>send</button>
    </div>
  );
}

export default App;
