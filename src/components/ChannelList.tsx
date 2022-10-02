import styled from "@emotion/styled";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { IChannel } from "../typings/db";
import { fetcher } from "../utils/fetcher";

export const ChannelList = () => {
  const { talkspace } = useParams<{ talkspace: string }>();
  const [channelCollapse, setChannelCollapse] = useState(true);

  const { data: userData } = useSWR("http://localhost:3095/api/users", fetcher);
  const { data: channelData } = useSWR(
    userData
      ? `http://localhost:3095/api/workspaces/${talkspace}/channels`
      : null,
    fetcher
  );

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse(!channelCollapse);
  }, [channelCollapse]);

  return (
    <>
      <h2>
        <StyledCollapseButton
          collapse={channelCollapse}
          onClick={toggleChannelCollapse}
        >
          🔽
        </StyledCollapseButton>
        <span>채널 목록</span>
      </h2>
      <div>
        {channelCollapse &&
          channelData?.map((item: IChannel) => {
            return <div key={item.id}>{item.name}</div>;
          })}
      </div>
    </>
  );
};

export const StyledCollapseButton = styled.button<{ collapse: boolean }>`
  background: transparent;
  border: none;
  width: 26px;
  height: 26px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-left: 10px;
  cursor: pointer;
  ${({ collapse }) =>
    collapse &&
    `
    & i {
      transform: none;
    }
  `};
`;
