import styled from "@emotion/styled";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { ChatContent } from "../components/chat/ChatContent";
import { ChatInputBox } from "../components/chat/ChatInputBox";
import { InviteChannelModal } from "../components/modal/InviteChannelModal";
import { useInput } from "../hooks/useInput";
import { useSocket } from "../hooks/useSocket";
import { IChannel, IChat } from "../typings/db";
import { dateSection } from "../utils/dateSection";
import { fetcher } from "../utils/fetcher";

export const Channel = () => {
  const { talkspace, channel } = useParams<{
    talkspace: string;
    channel: string;
  }>();
  const [chat, onChangeChat, setChat] = useInput("");
  const scrollberRef = useRef<Scrollbars>(null);
  const [socket] = useSocket(talkspace);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const { data: userData } = useSWR("http://localhost:3095/api/users", fetcher);
  const { data: channelMemberData } = useSWR(
    userData
      ? `http://localhost:3095/api/workspaces/${talkspace}/channels/${channel}/members`
      : null,
    fetcher
  );
  const { data: channelData } = useSWR<IChannel>(
    `http://localhost:3095/api/workspaces/${talkspace}/channels/${channel}`,
    fetcher
  );
  const {
    data: chatData,
    mutate: chatMutate,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) =>
      `http://localhost:3095/api/workspaces/${talkspace}/channels/${channel}/chats?perPage=20&page=${
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
      if (chat?.trim() && chatData && channelData) {
        // Optimistic UI
        const optimisticData = chat;
        chatMutate((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: optimisticData,
            UserId: userData.id,
            User: userData,
            ChannelId: channelData.id,
            Channel: channelData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat("");
          scrollberRef.current?.scrollToBottom();
        });
        axios
          .post(
            `http://localhost:3095/api/workspaces/${talkspace}/channels/${channel}/chats`,
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
    [
      chat,
      talkspace,
      channel,
      setChat,
      chatMutate,
      chatData,
      userData,
      channelData,
    ]
  );

  const getMessage = useCallback(
    (data: IChat) => {
      if (data.Channel.name === channel && data.UserId !== userData?.id) {
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
    [channel, userData, chatMutate]
  );

  useEffect(() => {
    socket?.on("message", getMessage);
    return () => {
      socket?.off("message", getMessage);
    };
  }, [socket, getMessage]);

  // 스크롤 최하단부터 보여주기
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollberRef.current?.scrollToBottom();
    }
  }, [chatData]);

  const chatSections = dateSection(chatData ? chatData.flat().reverse() : []);

  const onClickInvite = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  if (!userData) return null;

  return (
    <StyledContainer>
      <StyledHeader>
        <div>
          <h2># {channel}</h2>
          <span className="user-count">
            대화상대 {channelMemberData?.length}명
          </span>
        </div>
        <button className="invite-button" onClick={onClickInvite}>
          초대하기
        </button>
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
      <InviteChannelModal
        show={showInviteChannelModal}
        setShow={setShowInviteChannelModal}
        onCloseModal={onCloseModal}
      />
    </StyledContainer>
  );
};

export const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: calc(100vh - 38px);
  flex-flow: column;
  position: relative;
`;

export const StyledHeader = styled.header`
  height: 40px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  div {
    display: flex;
    align-items: center;
  }
  .user-count {
    color: #999;
    font-size: 14px;
    margin: 0 10px;
  }
  .invite-button {
    width: 100px;
    height: 40px;
    margin-bottom: 1rem;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 0.5rem;
    font-size: 1rem;
    background: #343a40;
    color: #fff;
    cursor: pointer;
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
