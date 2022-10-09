import styled from "@emotion/styled";
import axios from "axios";
import gravatar from "gravatar";
import { useCallback, useEffect, useRef } from "react";
import Scrollbars from "react-custom-scrollbars";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { ChatContent } from "../components/chat/ChatContent";
import { ChatInputBox } from "../components/chat/ChatInputBox";
import { useInput } from "../hooks/useInput";
import { useSocket } from "../hooks/useSocket";
import { IDM } from "../typings/db";
import { dateSection } from "../utils/dateSection";
import { fetcher } from "../utils/fetcher";

export const DM = () => {
  const { talkspace, id } = useParams<{ talkspace: string; id: string }>();
  const [chat, onChangeChat, setChat] = useInput("");
  const scrollberRef = useRef<Scrollbars>(null);
  const [socket] = useSocket(talkspace);

  const { data: userData } = useSWR("http://localhost:3095/api/users", fetcher);
  const { data: memberData } = useSWR(
    `http://localhost:3095/api/workspaces/${talkspace}/users/${id}`,
    fetcher
  );

  const {
    data: chatData,
    mutate: chatMutate,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) =>
      `http://localhost:3095/api/workspaces/${talkspace}/dms/${id}/chats?perPage=20&page=${
        index + 1
      }`,
    fetcher
  );
  const isEmpty = chatData?.[0]?.length === 0;
  const isLast =
    isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20);

  const onSubmitForm = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        // Optimistic UI
        const optimisticData = chat;
        chatMutate((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: optimisticData,
            SenderId: userData.id,
            Sender: userData,
            ReceiverId: memberData.id,
            Receiver: memberData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat("");
          scrollberRef.current?.scrollToBottom();
        });
        axios
          .post(
            `http://localhost:3095/api/workspaces/${talkspace}/dms/${id}/chats`,
            {
              content: chat,
            },
            {
              withCredentials: true,
            }
          )
          .then(() => {
            chatMutate(chatData);
          })
          .catch((error) => {
            console.dir(error);
          });
      }
    },
    [chat, talkspace, id, setChat, chatMutate, chatData, userData, memberData]
  );

  const getMessage = useCallback(
    (data: IDM) => {
      if (data.SenderId === Number(id) && userData.id !== Number(id)) {
        chatMutate((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          if (scrollberRef.current) {
            if (
              scrollberRef.current.getScrollHeight() <
              scrollberRef.current.getClientHeight() +
                scrollberRef.current.getScrollTop() +
                200
            ) {
              scrollberRef.current.scrollToBottom();
            }
          }
        });
      }
    },
    [id, userData, chatMutate]
  );

  useEffect(() => {
    socket?.on("dm", getMessage);
    return () => {
      socket?.off("dm", getMessage);
    };
  }, [socket, getMessage]);

  // 스크롤 최하단부터 보여주기
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollberRef.current?.scrollToBottom();
    }
  }, [chatData]);

  const chatSections = dateSection(chatData ? chatData.flat().reverse() : []);

  if (!userData || !memberData) return null;

  return (
    <StyeldContainer>
      <StyledHeader>
        <img
          src={gravatar.url(memberData?.email, { d: "retro" })}
          alt={memberData?.nickname}
        />
        <span>{memberData?.nickname}</span>
      </StyledHeader>
      <ChatContent
        chatSections={chatSections}
        scrollberRef={scrollberRef}
        setSize={setSize}
        isLast={isLast}
      />
      <ChatInputBox
        chat={chat}
        onChangeChat={onChangeChat}
        onSubmitForm={onSubmitForm}
      />
    </StyeldContainer>
  );
};

export const StyeldContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: calc(100vh - 38px);
  flex-flow: column;
  position: relative;
`;

export const StyledHeader = styled.header`
  height: 64px;
  display: flex;
  width: 100%;
  --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
  box-shadow: 0 1px 0 var(--saf-0);
  padding: 20px 16px 20px 20px;
  font-weight: bold;
  align-items: center;
  & img {
    margin-right: 5px;
  }
`;

export const StyledDragOver = styled.div`
  position: absolute;
  top: 64px;
  left: 0;
  width: 100%;
  height: calc(100% - 64px);
  background: white;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
`;
