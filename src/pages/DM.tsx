import styled from "@emotion/styled";
import axios from "axios";
import gravatar from "gravatar";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { ChatContent } from "../components/chat/ChatContent";
import { ChatInputBox } from "../components/chat/ChatInputBox";
import { useInput } from "../hooks/useInput";
import { fetcher } from "../utils/fetcher";

export const DM = () => {
  const { talkspace, id } = useParams<{ talkspace: string; id: string }>();
  const [chat, onChangeChat, setChat] = useInput("");

  const { data: userData } = useSWR("http://localhost:3095/api/users", fetcher);
  const { data: memberData } = useSWR(
    `http://localhost:3095/api/workspaces/${talkspace}/users/${id}`,
    fetcher
  );
  const { data: chatData, mutate: chatMutate } = useSWR(
    userData && memberData
      ? `http://localhost:3095/api/workspaces/${talkspace}/dms/${id}/chats?perPage=20&page=1`
      : null,
    fetcher
  );

  const onSubmitForm = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (chat?.trim()) {
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
            setChat("");
          })
          .catch((error) => {
            console.dir(error);
          });
      }
    },
    [chat, talkspace, id, setChat, chatMutate, chatData]
  );

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
      <ChatContent chatData={chatData} />
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
