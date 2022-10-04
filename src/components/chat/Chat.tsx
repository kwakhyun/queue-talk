import styled from "@emotion/styled";
import { FC } from "react";
import { IDM } from "../../typings/db";
import gravatar from "gravatar";
import dayjs from "dayjs";

interface IPorps {
  data: IDM | any;
}

export const Chat: FC<IPorps> = ({ data }) => {
  const user = data.Sender;

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
        <p>{data.content}</p>
      </div>
    </StyledChat>
  );
};

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
