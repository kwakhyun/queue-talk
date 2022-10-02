import { useCallback, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import useSWR from "swr";
import { IUserWithOnline } from "../typings/db";
import { fetcher } from "../utils/fetcher";
import { StyledCollapseButton } from "./ChannelList";

export const DMList = () => {
  const { talkspace } = useParams<{ talkspace: string }>();
  const [channelCollapse, setChannelCollapse] = useState(true);

  const { data: userData } = useSWR("http://localhost:3095/api/users", fetcher);
  const { data: memberData } = useSWR(
    userData
      ? `http://localhost:3095/api/workspaces/${talkspace}/members`
      : null,
    fetcher
  );

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse(!channelCollapse);
  }, [channelCollapse]);

  return (
    <div>
      <h2>
        <StyledCollapseButton
          collapse={channelCollapse}
          onClick={toggleChannelCollapse}
        >
          🔽
        </StyledCollapseButton>
        <span>1:1 채팅 목록</span>
      </h2>
      <div>
        {channelCollapse &&
          memberData?.map((item: IUserWithOnline) => {
            return (
              <NavLink
                key={item.id}
                to={`/talkspace/${talkspace}/dm/${item.id}`}
              >
                {item.nickname}
                {item.id === userData?.id && <span>👑</span>}
                {item.online && item.id !== userData?.id && <span>🟢</span>}
                {!item.online && item.id !== userData?.id && <span>🔴</span>}
              </NavLink>
            );
          })}
      </div>
    </div>
  );
};
