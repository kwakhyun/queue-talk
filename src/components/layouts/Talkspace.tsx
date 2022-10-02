import styled from "@emotion/styled";
import axios from "axios";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "../../utils/fetcher";
import gravatar from "gravatar";
import { Menu } from "../menu/Menu";
import { ITalkspace } from "../../typings/db";
import { CreateChannelModal } from "../modal/CreateChannelModal";
import { CreateTalkspace } from "../modal/CreateTalkspaceModal";
import { InviteTalkspaceModal } from "../modal/InviteTalkspaceModal";
import { InviteChannelModal } from "../modal/InviteChannelModal";
import { ChannelList } from "../ChannelList";
import { DMList } from "../DMList";
import { Channel } from "../../pages/Channel";
import { DM } from "../../pages/DM";

export const Talkspace = ({ children }: PropsWithChildren) => {
  const { talkspace } = useParams<{ talkspace: string }>();
  const navigate = useNavigate();
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

  // useEffect(() => {
  //   navigate("/dd/");
  // }, [navigate]);

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
    <div>
      <StyledHeader>
        <StyledRightMenu>
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
                  <span id="profile-active">Active</span>
                </StyledProfileModal>
                <StyledLogOutButton onClick={onLogout}>
                  로그아웃
                </StyledLogOutButton>
              </Menu>
            )}
          </div>
        </StyledRightMenu>
      </StyledHeader>
      <StyledTalkspaceWrapper>
        <StyledTalkspaces>
          {userData?.Workspaces.map((item: ITalkspace) => {
            return (
              <Link key={item.id} to={``}>
                <StyledTalkspaceButton>
                  {item.name.slice(0, 1).toUpperCase()}
                </StyledTalkspaceButton>
              </Link>
            );
          })}
          <StyledAddButton onClick={onClickCreateTalkspace}>+</StyledAddButton>
        </StyledTalkspaces>
        <StyledChannels>
          <StyledTalkspaceName onClick={toggleTalkspaceModal}>
            QueueTalk
          </StyledTalkspaceName>
          <StyledMenuScroll>
            {showTalkspaceModal && (
              <Menu
                style={{ top: 130, left: 70 }}
                show={showTalkspaceModal}
                onCloseModal={toggleTalkspaceModal}
              >
                <StyledTalkspaceModal>
                  <h2>dd</h2>
                  <button onClick={onClickInviteTalkspace}>
                    톡 스페이스에 유저 초대하기
                  </button>
                  <button onClick={onClickAddChannel}>채널 생성</button>
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
    </div>
  );
};

export const StyledRightMenu = styled.div`
  float: right;
`;

export const StyledHeader = styled.header`
  height: 50px;
  background: #134381;
  color: #ffffff;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.1);
  padding: 5px;
  text-align: center;
`;

export const StyledProfileImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25%;
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
  & #profile-name {
    font-weight: bold;
    display: inline-flex;
  }
  & #profile-active {
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
  background: #134381;
  border-top: 1px solid #eee;
  border-right: 1px solid #eee;
  vertical-align: top;
  text-align: center;
  padding: 15px 0 0;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

export const StyledChannels = styled.nav`
  width: 260px;
  display: inline-flex;
  flex-direction: column;
  background: #134381;
  color: rgb(188, 171, 188);
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
      color: white;
    }
  }
  & .bold {
    color: white;
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
    color: white;
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
  height: 64px;
  line-height: 64px;
  border: none;
  width: 100%;
  text-align: left;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  font-weight: 900;
  font-size: 24px;
  background: transparent;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0;
  padding-left: 16px;
  margin: 0;
  color: white;
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
  color: white;
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
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: white;
  border: 3px solid #134381;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 700;
  color: black;
  cursor: pointer;
`;
