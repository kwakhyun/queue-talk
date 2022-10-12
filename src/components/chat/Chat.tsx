import styled from "@emotion/styled";
import { FC, memo, useMemo } from "react";
import { IChat, IDM } from "../../typings/db";
import gravatar from "gravatar";
import dayjs from "dayjs";
import regexifyString from "regexify-string";
import { useNavigate, useParams } from "react-router-dom";

interface IPorps {
  data: IDM | IChat;
}

export const Chat: FC<IPorps> = memo(({ data }) => {
  const navigate = useNavigate();
  const { talkspace } = useParams<{ talkspace: string; channel: string }>();
  const user = "Sender" in data ? data.Sender : data.User;

  const regexifyContent = useMemo(
    () =>
      data.content.startsWith("uploads\\") ? (
        <img
          src={`http://localhost:3095/${data.content}`}
          alt={data.content}
          style={{ maxWidth: 500 }}
        />
      ) : (
        regexifyString({
          input: data.content,
          pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
          decorator(match, index) {
            const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
            if (arr) {
              return (
                <span
                  key={index}
                  style={{ cursor: "pointer", backgroundColor: "lightgreen" }}
                  onClick={() =>
                    navigate(`/talkspace/${talkspace}/dm/${arr[2]}`)
                  }
                >
                  @{arr[1]}
                </span>
              );
            }
            return <br key={index} />;
          },
        })
      ),
    [data.content, navigate, talkspace]
  );

  return (
    <StyledChat>
      <div className="chat-img">
        <img
          src={gravatar.url(user.email, { d: "retro" })}
          alt={user.nickname}
        />
      </div>
      <div className="chat-text">
        <div className="chat-name">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format("A h:mm")}</span>
        </div>
        <p>{regexifyContent}</p>
      </div>
    </StyledChat>
  );
});

export const StyledChat = styled.div`
  display: flex;
  padding: 8px 20px;
  &:hover {
    background: #eee;
  }
  & .chat-img {
    display: flex;
    width: 36px;
    margin-right: 8px;
    & img {
      width: 36px;
      height: 36px;
    }
  }
`;
