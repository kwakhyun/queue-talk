import styled from "@emotion/styled";
import { FC, useCallback, useRef } from "react";
import { IDM } from "../../typings/db";
import { Chat } from "./Chat";
import { Scrollbars } from "react-custom-scrollbars";

interface IPorps {
  chatData?: IDM[];
}

export const ChatContent: FC<IPorps> = ({ chatData }) => {
  const scrollberRef = useRef<Scrollbars>(null);
  const onScroll = useCallback(() => {}, []);
  console.log(chatData);

  return (
    <StyledChatZone>
      <Scrollbars autoHide ref={scrollberRef} onScroll={onScroll}>
        {chatData
          ?.sort((a: IDM, b: IDM) => a.id - b.id)
          .map((chat) => {
            return <Chat key={chat.id} data={chat} />;
          })}
      </Scrollbars>
    </StyledChatZone>
  );
};

export const StyledChatZone = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
`;

export const StyledSection = styled.section`
  margin-top: 20px;
  border-top: 1px solid #eee;
`;

export const StyledStickyHeader = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  width: 100%;
  position: sticky;
  top: 14px;
  & button {
    font-weight: bold;
    font-size: 13px;
    height: 28px;
    line-height: 27px;
    padding: 0 16px;
    z-index: 2;
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 0 0 1px var(--saf-0), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
    border-radius: 24px;
    position: relative;
    top: -13px;
    background: white;
    border: none;
    outline: none;
  }
`;
