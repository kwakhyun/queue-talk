import styled from "@emotion/styled";
import axios from "axios";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "../../utils/fetcher";
import gravatar from "gravatar";
import { Menu } from "../menu/Menu";
import { IChannel, ITalkspace } from "../../typings/db";
import { CreateChannelModal } from "../modal/CreateChannelModal";
import { CreateTalkspace } from "../modal/CreateTalkspaceModal";
import { InviteTalkspaceModal } from "../modal/InviteTalkspaceModal";
import { InviteChannelModal } from "../modal/InviteChannelModal";
import { ChannelList } from "../ChannelList";
import { DMList } from "../DMList";
import { Channel } from "../../pages/Channel";
import { DM } from "../../pages/DM";
import { useSocket } from "../../hooks/useSocket";

export const Talkspace = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { talkspace } = useParams<{ talkspace: string }>();
  const [socket, disconnect] = useSocket(talkspace);

  const [showMenu, setShowMenu] = useState(false);
  const [showCreateTalkspaceModal, setShowCreateTalkspaceModal] =
    useState(false);
  const [showInviteTalkspaceModal, setShowInviteTalkspaceModal] =
    useState(false);
  const [showTalkspaceModal, setShowTalkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const {
    data: userData,
    error,
    mutate,
  } = useSWR("http://localhost:3095/api/users", fetcher);

  const { data: channelData } = useSWR(
    userData
      ? `http://localhost:3095/api/workspaces/${talkspace}/channels`
      : null,
    fetcher
  );

  // const { data: memberData } = useSWR(
  //   userData
  //     ? `http://localhost:3095/api/workspaces/${talkspace}/members`
  //     : null,
  //   fetcher
  // );

  // 웹 소켓 연결 확인
  useEffect(() => {
    if (userData && channelData && socket) {
      console.log(socket);
      socket.emit("login", {
        id: userData.id,
        channels: channelData.map((v: IChannel) => v.id),
      });
    }
  }, [userData, channelData, socket]);

  // 웹 소켓 연결 해제
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect, talkspace]);

  const onLogout = useCallback(() => {
    axios
      .post("http://localhost:3095/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false, false);
      });
  }, [mutate]);

  const onClickUserProfile = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setShowMenu(!showMenu);
    },
    [showMenu]
  );

  const onClickCreateTalkspace = useCallback(() => {
    setShowCreateTalkspaceModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateTalkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteTalkspaceModal(false);
    setShowInviteChannelModal(false);
  }, []);

  const toggleTalkspaceModal = useCallback(() => {
    setShowTalkspaceModal(!showTalkspaceModal);
  }, [showTalkspaceModal]);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const onClickInviteTalkspace = useCallback(() => {
    setShowInviteTalkspaceModal(true);
  }, []);

  if (userData === undefined) {
    return <div>로딩중...</div>;
  }
  if (!userData) navigate("/login");
  if (error) alert("서버와 연결이 불안정합니다.");

  return (
    <StyledContainer>
      <StyledHeader>
        <h1>QueueTalk</h1>
        <div>
          <div onClick={onClickUserProfile}>
            <StyledProfileImg
              src={gravatar.url(userData?.email, { d: "retro" })}
              alt={userData?.nickname}
            />
            {showMenu && (
              <Menu
                style={{ top: 50, right: 0 }}
                show={showMenu}
                onCloseModal={onClickUserProfile}
              >
                <StyledProfileModal>
                  <img
                    src={gravatar.url(userData?.email, { d: "retro" })}
                    alt={userData?.nickname}
                  />
                  <span id="profile-name">{userData?.nickname}</span>
                  <span id="profile-email">{userData?.email}</span>
                </StyledProfileModal>
                <StyledLogOutButton onClick={onLogout}>
                  로그아웃
                </StyledLogOutButton>
              </Menu>
            )}
          </div>
        </div>
      </StyledHeader>
      <StyledTalkspaceWrapper>
        <StyledTalkspaces>
          {userData?.Workspaces.map((item: ITalkspace) => {
            return (
              <NavLink
                key={item.id}
                to={`/talkspace/${item.name}/channel/일반`}
              >
                <StyledTalkspaceButton>
                  {item.name.slice(0, 2)}
                </StyledTalkspaceButton>
              </NavLink>
            );
          })}
          <StyledAddButton onClick={onClickCreateTalkspace}>+</StyledAddButton>
        </StyledTalkspaces>
        <StyledChannels>
          <StyledTalkspaceName onClick={toggleTalkspaceModal}>
            초대 또는 채널 만들기
          </StyledTalkspaceName>
          <StyledMenuScroll>
            {showTalkspaceModal && (
              <Menu
                style={{ top: 130, left: 70 }}
                show={showTalkspaceModal}
                onCloseModal={toggleTalkspaceModal}
              >
                <StyledTalkspaceModal>
                  <h2>{talkspace}</h2>
                  <button onClick={onClickInviteTalkspace}>
                    <b>{talkspace}</b>으로 유저 초대하기
                  </button>
                  <button onClick={onClickAddChannel}>
                    <b>{talkspace}</b>에 새로운 채널 생성
                  </button>
                  <button onClick={onLogout}>로그아웃</button>
                </StyledTalkspaceModal>
              </Menu>
            )}
            <ChannelList />
            <DMList />
          </StyledMenuScroll>
        </StyledChannels>

        <StyledChatView>
          <Routes>
            <Route path="/channel/:channel" element={<Channel />} />
            <Route path="/dm/:id" element={<DM />} />
          </Routes>
        </StyledChatView>
      </StyledTalkspaceWrapper>
      {children}
      <CreateTalkspace
        show={showCreateTalkspaceModal}
        setShow={setShowCreateTalkspaceModal}
        onCloseModal={onCloseModal}
      />
      <CreateChannelModal
        show={showCreateChannelModal}
        setShow={setShowCreateChannelModal}
        onCloseModal={onCloseModal}
      />
      <InviteTalkspaceModal
        show={showInviteTalkspaceModal}
        setShow={setShowInviteTalkspaceModal}
        onCloseModal={onCloseModal}
      />
      <InviteChannelModal
        show={showInviteChannelModal}
        setShow={setShowInviteChannelModal}
        onCloseModal={onCloseModal}
      />
    </StyledContainer>
  );
};

const StyledContainer = styled.div``;

export const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background: #031930;
  color: #fff;
  border: 5px solid #fff;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.1);
  padding: 5px 20px;
  text-align: center;
`;

export const StyledProfileImg = styled.img`
  width: 40px;
  height: 40px;
  border: 4px solid #fff;
  border-radius: 50%;
  margin-top: 3px;
`;

export const StyledProfileModal = styled.div`
  display: flex;
  padding: 20px;
  & img {
    display: flex;
  }
  & > div {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }
  #profile-name {
    font-weight: bold;
    display: inline-flex;
    margin: 0 10px;
  }
  #profile-email {
    font-size: 13px;
    display: inline-flex;
  }
`;

export const StyledLogOutButton = styled.button`
  border: none;
  width: 100%;
  border-top: 1px solid rgb(29, 28, 29);
  background: transparent;
  display: block;
  height: 33px;
  padding: 5px 20px 5px;
  outline: none;
  cursor: pointer;
`;

export const StyledTalkspaceWrapper = styled.div`
  display: flex;
  flex: 1;
`;

export const StyledTalkspaces = styled.div`
  width: 65px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: #031930;
  border-right: 5px solid #eee;
  vertical-align: top;
  text-align: center;
  padding: 15px 0 0;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

export const StyledChannels = styled.nav`
  width: 260px;
  display: inline-flex;
  flex-direction: column;
  background: #031930;
  color: #fff;

  vertical-align: top;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  & a {
    padding-left: 36px;
    color: inherit;
    text-decoration: none;
    height: 28px;
    line-height: 28px;
    display: flex;
    align-items: center;
    &.selected {
      color: #fff;
    }
  }
  & .bold {
    color: #fff;
    font-weight: bold;
  }
  & .count {
    margin-left: auto;
    background: #cd2553;
    border-radius: 16px;
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    height: 18px;
    line-height: 18px;
    padding: 0 9px;
    color: #fff;
    margin-right: 16px;
  }
  & h2 {
    height: 36px;
    line-height: 36px;
    margin: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 15px;
  }
`;

export const StyledTalkspaceName = styled.button`
  height: 50px;
  border: none;
  width: 100%;
  text-align: center;
  border-bottom: 5px solid #eee;
  font-weight: 900;
  font-size: 18px;
  color: #fff;
  background: transparent;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

export const StyledMenuScroll = styled.div`
  height: calc(100vh - 102px);
  overflow-y: auto;
`;

export const StyledTalkspaceModal = styled.div`
  padding: 10px 0 0;
  & h2 {
    padding-left: 20px;
  }
  & > button {
    width: 100%;
    height: 28px;
    padding: 4px;
    border: none;
    background: transparent;
    border-top: 1px solid rgb(28, 29, 28);
    cursor: pointer;
    &:last-of-type {
      border-bottom: 1px solid rgb(28, 29, 28);
    }
  }
`;

export const StyledChatView = styled.div`
  flex: 1;
`;

export const StyledAddButton = styled.button`
  color: #fff;
  font-size: 24px;
  display: inline-block;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
`;

export const StyledTalkspaceButton = styled.button`
  display: inline-block;
  width: 50px;
  height: 30px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 700;
  color: black;
  cursor: pointer;
`;
