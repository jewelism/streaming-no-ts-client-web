import React, { useState } from 'react';

interface IRoomProps {
  rooms: string[];
  onClickJoin: (roomId: string, nickname: string) => void;
}
function Room({ rooms, onClickJoin }: IRoomProps) {
  const [myNickname, setMyNickname] = useState<string>('');

  return (
    <>
      <input value={myNickname} onChange={e => setMyNickname(e.target.value)} placeholder="your nickname" />
      {rooms.map(roomId => <RoomItem key={roomId} roomId={roomId} onClick={() => onClickJoin(roomId, myNickname)} />)}
    </>
  );
}

function RoomItem({ onClick, roomId }: { onClick: () => void, roomId: string }) {
  return (
    <button type="button" onClick={onClick}>{roomId}</button>
  );
}

export default Room;