import React, { useCallback } from 'react';
import { IMessage, IMember } from '../types';

interface IMessageProps {
  messages: IMessage[];
  members: IMember[];
}
function Message({ messages, members }: IMessageProps) {
  const getSenderNickname = useCallback((senderId: string) => members.find(({ socketId }) => senderId === socketId)?.nickname ?? 'anonymous', [members]);
  return (
    <div>
      {messages.map(({ mine, senderId, date, text }, index) =>
        <MessageItem key={`${date}${index}`} mine={mine} sender={getSenderNickname(senderId)} date={date} text={text} />
      )}
    </div>
  );
}

function MessageItem(
  { mine = false, sender, date, text }
    : { mine: boolean | undefined; sender: string, date: number, text: string }
) {
  return (
    <div>{mine ? 'me' : sender}: {text}</div>
  );
}

export default Message;