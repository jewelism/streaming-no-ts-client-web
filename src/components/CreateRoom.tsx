import React, { useState } from 'react';
import { CHAT_API_URL } from '../App';

function CreateRoom({ getRooms }: { getRooms: () => void }) {
  const [roomId, setRoomId] = useState<string>('');

  const onClickSubmit = () => {
    fetch(`${CHAT_API_URL}room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomId })
    }).then(res => res.text()).then(res => {
      getRooms();
      alert(res);
    });
  };

  return (
    <>
      <div>create room!</div>
      <input value={roomId} onChange={e => setRoomId(e.target.value)} placeholder="input room title" />
      <button onClick={onClickSubmit}>create room</button>
    </>
  );
}


export default CreateRoom;