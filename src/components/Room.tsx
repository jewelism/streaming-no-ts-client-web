import React, { useState, useMemo } from 'react';

interface IRoomProps {
  rooms: string[];
  onClickJoin: (roomId: string, nickname: string) => void;
}
function Room({ rooms, onClickJoin }: IRoomProps) {
  const [myNickname, setMyNickname] = useState<string>('');

  const isRoomExist = useMemo(() => !!rooms.length, [rooms]);
  return (
    <>
      <div>join rooms!</div>
      {isRoomExist ?
        <input value={myNickname} onChange={e => setMyNickname(e.target.value)} placeholder="your nickname" />
        :
        <div>no rooms!</div>
      }
      <br />
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