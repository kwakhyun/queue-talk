import styled from "@emotion/styled";
import { useCallback } from "react";
import { ChatContent } from "../components/chat/ChatContent";
import { ChatInputBox } from "../components/chat/ChatInputBox";
import { Talkspace } from "../components/layouts/Talkspace";
import { useInput } from "../hooks/useInput";

export const Channel = () => {
  const [chat, onChangeChat] = useInput("");

  const onSubmitForm = useCallback((e: { preventDefault: () => void }) => {
    e.preventDefault();
  }, []);

  return (
    <Talkspace>
      <StyledContainer>
        <StyledHeader>Channel</StyledHeader>
        <ChatContent />
        <ChatInputBox
          chat={chat}
          onChangeChat={onChangeChat}
          onSubmitForm={onSubmitForm}
        />
      </StyledContainer>
    </Talkspace>
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
  height: 64px;
  display: flex;
  width: 100%;
  --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
  box-shadow: 0 1px 0 var(--saf-0);
  padding: 20px 16px 20px 20px;
  font-weight: bold;
  align-items: center;
  /* & .header-right {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center; */
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
