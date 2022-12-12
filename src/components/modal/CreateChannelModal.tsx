import axios from "axios";
import { FC, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useInput } from "../../hooks/useInput";
import { Modal } from "./Modal";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetcher } from "../../utils/fetcher";

interface IProps {
  show: boolean;
  setShow: (show: boolean) => void;
  onCloseModal: () => void;
}

export const CreateChannelModal: FC<IProps> = ({
  show,
  setShow,
  onCloseModal,
}) => {
  const { talkspace } = useParams<{ talkspace: string }>();
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput("");

  const { data: userData } = useSWR(`${process.env.REACT_APP_SERVER_URL}/api/users`, fetcher);
  const { data: channelData, mutate: channelMutate } = useSWR(
    userData
      ? `${process.env.REACT_APP_SERVER_URL}/api/workspaces/${talkspace}/channels`
      : null,
    fetcher
  );

  const onCreateChannel = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (!newChannel || !newChannel.trim()) return;
      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}/api/workspaces/${talkspace}/channels`,
          {
            name: newChannel,
          },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          setShow(false);
          setNewChannel("");
          channelMutate(channelData);
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: "bottom-center" });
        });
    },
    [newChannel, talkspace, setShow, setNewChannel, channelMutate, channelData]
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <label id="channel-label">
          <span>채널 이름</span>
          <input
            name="channel"
            type="text"
            value={newChannel}
            onChange={onChangeNewChannel}
          />
        </label>
        <button type="submit">생성하기</button>
      </form>
    </Modal>
  );
};
