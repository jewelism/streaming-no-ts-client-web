export interface IMessage {
  senderId: string;
  date: number;
  text: string;
  mine?: boolean;
}

export interface IRoom {
  roomId: string;
  nickname: string;
  socketId: string
}

export interface IMember {
  roomId: string;
  nickname: string;
  socketId: string
}