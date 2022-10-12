import styled from "@emotion/styled";
import { FC, RefObject, useCallback } from "react";
import { IChat, IDM } from "../../typings/db";
import { Chat } from "./Chat";
import { positionValues, Scrollbars } from "react-custom-scrollbars";

interface IPorps {
  chatSections: { [key: string]: (IDM | IChat)[] };
  scrollberRef: RefObject<Scrollbars>;
  setSize: (
    f: (indux: number) => number
  ) => Promise<(IDM | IChat)[][] | undefined>;
  isLast: boolean | undefined;
}

export const ChatContent: FC<IPorps> = ({
  chatSections,
  scrollberRef,
  setSize,
  isLast,
}) => {
  const onScroll = useCallback(
    (values: positionValues) => {
      if (values.scrollTop === 0 && !isLast) {
        setSize((prevSize) => prevSize + 1).then(() => {
          scrollberRef.current?.scrollTop(
            scrollberRef.current?.getScrollHeight() - values.scrollHeight
          );
        });
      }
    },
    [isLast, setSize, scrollberRef]
  );
  console.log(chatSections);

  return (
    <StyledChatZone>
      <Scrollbars autoHide ref={scrollberRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <StyledSection key={date}>
              <StyledStickyHeader>
                <button>{date}</button>
              </StyledStickyHeader>
              {chats
                // ?.sort((a: IDM, b: IDM) => a.id - b.id)
                ?.map((chat) => {
                  return <Chat key={chat.id} data={chat} />;
                })}
            </StyledSection>
          );
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
