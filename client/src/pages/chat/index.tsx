import { NextPage } from 'next';
import React, { FormEvent, ReactElement, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { io, Socket } from 'socket.io-client';
import { user } from '../../atoms/user';
import Layout from '../../components/layout';
import { Message, ServerToClientInitData } from '../../types/chat';
import type { NextPageWithLayout } from '../_app';
import { RoomList, ChattingArea, Main } from './index.styled';

const Chat: NextPageWithLayout = () => {
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const [serverState, setServerState] = useState<ServerToClientInitData>({});
  const [chatListState, setChatListState] = useState<Message[]>([]);
  const [roomState, setRoomState] = useState<number>();
  const [chatInputState, setChatInputState] = useState('');
  const userState = useRecoilValue(user);

  useEffect(() => {
    const socket = io(`http://localhost:8000`, {
      transports: ['websocket'],
    });

    socket.on('welcome', (data: ServerToClientInitData) => {
      setServerState({ ...data });
    });

    setCurrentSocket(socket);
  }, []);

  useEffect(() => {
    currentSocket?.on('chat-message', (data: Message) => {
      console.log(data);
      setChatListState([...chatListState, data]);
    });

    currentSocket?.on('leaveRoom', (data: Message) => {
      console.log(data);
      setChatListState([
        ...chatListState,
        {
          name: data.name,
          roomNumber: data.roomNumber,
          message: `${data.roomNumber}번 방을 퇴장하셨습니다.`,
        },
      ]);
    });

    currentSocket?.on('joinRoom', (data: Message) => {
      console.log(data);
      setChatListState([
        ...chatListState,
        {
          name: data.name,
          roomNumber: data.roomNumber,
          message: `${data.roomNumber}번 방에 입장하셨습니다.`,
        },
      ]);
    });
  }, [chatListState, currentSocket, roomState]);

  const handleRoomChange = (roomNumber: string) => {
    if (roomState !== Number(roomNumber)) {
      setRoomState(Number(roomNumber));
      setChatListState([]);
      if (roomState! >= 0)
        currentSocket?.emit('leaveRoom', {
          roomNumber: roomState,
          name: userState.name,
        });
      currentSocket?.emit('joinRoom', {
        roomNumber: Number(roomNumber),
        name: userState.name,
      });
    }
  };

  const handleChatSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    currentSocket?.emit('chat-message', {
      name: userState.name,
      roomNumber: roomState,
      message: chatInputState,
    } as Message);
    setChatInputState('');
  };

  return (
    <Main>
      {currentSocket && (
        <>
          <RoomList
            roomState={roomState}
            socket={currentSocket}
            allUser={serverState?.allUser}
            roomList={serverState?.createdRoom}
            handleRoomChange={handleRoomChange}
          />
          <ChattingArea
            socket={currentSocket}
            chatList={chatListState}
            handleChatSubmit={handleChatSubmit}
            chatInputState={chatInputState}
            setChatInputState={setChatInputState}
          />
        </>
      )}
    </Main>
  );
};

Chat.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Chat;
