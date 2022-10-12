import { useCallback, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import useSWR from "swr";
import { useSocket } from "../hooks/useSocket";
import { IUserWithOnline } from "../typings/db";
import { fetcher } from "../utils/fetcher";
import { StyledCollapseButton } from "./ChannelList";

export const DMList = () => {
  const { talkspace } = useParams<{ talkspace: string }>();
  const [socket] = useSocket(talkspace);

  const [channelCollapse, setChannelCollapse] = useState(true);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const { data: userData } = useSWR("http://localhost:3095/api/users", fetcher);
  const { data: memberData } = useSWR(
    userData
      ? `http://localhost:3095/api/workspaces/${talkspace}/members`
      : null,
    fetcher
  );
  console.log(memberData);
  useEffect(() => {
    socket?.on("onlineList", (data: number[]) => {
      setOnlineList(data);
    });

    return () => {
      socket?.off("onlineList");
    };
  }, [socket]);

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
          Array.isArray(memberData) &&
          memberData?.map((item: IUserWithOnline) => {
            const isOnline = onlineList.includes(item.id);

            return (
              <NavLink
                key={item.id}
                to={`/talkspace/${talkspace}/dm/${item.id}`}
              >
                {item.nickname}
                {item.id === userData?.id && <span>👑</span>}
                {isOnline && item.id !== userData?.id && <span>🟢</span>}
                {!isOnline && item.id !== userData?.id && <span>🔴</span>}
              </NavLink>
            );
          })}
      </div>
    </div>
  );
};
