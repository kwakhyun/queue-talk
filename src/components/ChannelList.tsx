import { memo, useCallback, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import styled from "@emotion/styled";

import useSWR from "swr";
import { IChannel } from "../typings/db";
import { fetcher } from "../utils/fetcher";

export const ChannelList = memo(() => {
  const { talkspace } = useParams<{ talkspace: string }>();
  const [channelCollapse, setChannelCollapse] = useState(true);

  const { data: userData } = useSWR(
    `${process.env.REACT_APP_SERVER_URL}/api/users`,
    fetcher
  );
  const { data: channelData } = useSWR(
    userData
      ? `${process.env.REACT_APP_SERVER_URL}/api/workspaces/${talkspace}/channels`
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
          {channelCollapse ? "🔽" : "▶"}
        </StyledCollapseButton>
        <span>채널 목록</span>
      </h2>
      <div>
        {channelCollapse &&
          channelData?.map((item: IChannel) => {
            return (
              <NavLink
                key={item.id}
                to={`/talkspace/${talkspace}/channel/${item.name}`}
              >
                <span># {item.name}</span>
              </NavLink>
            );
          })}
      </div>
    </>
  );
});

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
