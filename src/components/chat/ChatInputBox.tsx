import styled from "@emotion/styled";
import { FC, ReactNode, useCallback, useEffect, useRef } from "react";
import autosize from "autosize";
import { MentionsInput, Mention, SuggestionDataItem } from "react-mentions";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "../../utils/fetcher";
import { IUser } from "../../typings/db";
import gravatar from "gravatar";

interface IProps {
  chat: string;
  onChangeChat: (e: any) => void;
  onSubmitForm: (e: any) => void;
}

export const ChatInputBox: FC<IProps> = ({
  chat,
  onChangeChat,
  onSubmitForm,
}) => {
  const { talkspace } = useParams<{ talkspace: string }>();
  const { data: userData } = useSWR("http://localhost:3095/api/users", fetcher);
  const { data: memberData } = useSWR(
    userData
      ? `http://localhost:3095/api/workspaces/${talkspace}/members`
      : null,
    fetcher
  );

  const mentionsInputRef = useRef(null);

  useEffect(() => {
    if (mentionsInputRef.current) {
      autosize(mentionsInputRef.current);
    }
  }, []);

  const onKeyDownEnter = useCallback(
    (e: { key: string; shiftKey: boolean }) => {
      if (e.key === "Enter") {
        if (!e.shiftKey) {
          onSubmitForm(e);
        }
      }
    },
    [onSubmitForm]
  );

  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: ReactNode,
      index: number,
      focused: boolean
    ): ReactNode => {
      if (!memberData) return;
      return (
        <StyledEachMention focus={focused}>
          <img
            src={gravatar.url(memberData[index].email, { s: "20", d: "retro" })}
            alt={memberData[index].nickname}
          />
          <span>{highlightedDisplay}</span>
        </StyledEachMention>
      );
    },
    [memberData]
  );

  return (
    <StyledChatArea>
      <StyledForm onSubmit={onSubmitForm}>
        <StyledMentionsInput
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeyDownEnter}
          inputRef={mentionsInputRef}
          allowSuggestionsAboveCursor
        >
          <Mention
            data={
              (Array.isArray(memberData) &&
                memberData?.map((v: IUser) => {
                  return { id: v.id, display: v.nickname };
                })) ||
              []
            }
            trigger="@"
            appendSpaceOnAdd
            renderSuggestion={renderSuggestion}
          ></Mention>
        </StyledMentionsInput>

        <button type="submit" disabled={!chat.trim()}>
          ENTER
        </button>
      </StyledForm>
    </StyledChatArea>
  );
};

export const StyledChatArea = styled.div`
  display: flex;
  padding: 20px;
  padding-top: 0;
`;

export const StyledForm = styled.form`
  color: rgb(29, 28, 29);
  font-size: 15px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid rgb(29, 28, 29);
  display: flex;
  button {
    color: #fff;
    background-color: #343a40;
  }
`;

export const StyledMentionsInput = styled(MentionsInput)`
  font-family: Slack-Lato, appleLogo, sans-serif;
  font-size: 15px;
  padding: 8px 9px;
  width: 100%;
  & strong {
    background: skyblue;
  }
  & textarea {
    height: 44px;
    padding: 9px 10px !important;
    outline: none !important;
    border-radius: 4px !important;
    resize: none !important;
    line-height: 22px;
    border: none;
  }
  & ul {
    border: 1px solid lightgray;
    max-height: 200px;
    overflow-y: auto;
    padding: 9px 10px;
    background: white;
    border-radius: 4px;
    width: 150px;
  }
`;

// export const StyledToolbox = styled.div`
//   position: relative;
//   background: rgb(248, 248, 248);
//   height: 41px;
//   display: flex;
//   border-top: 1px solid rgb(221, 221, 221);
//   align-items: center;
//   border-bottom-left-radius: 4px;
//   border-bottom-right-radius: 4px;
// `;

// export const StyledSendButton = styled.button`
//   position: absolute;
//   right: 5px;
//   top: 5px;
// `;

export const StyledEachMention = styled.button<{ focus: boolean }>`
  padding: 4px 20px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  color: rgb(28, 29, 28);
  width: 100%;
  & img {
    margin-right: 5px;
  }
  ${({ focus }) =>
    focus &&
    `
    background: #1264a3;
    color: white;
  `};
`;
