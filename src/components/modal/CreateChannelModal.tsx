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

  const { data: userData } = useSWR("http://localhost:3095/api/users", fetcher);
  const { mutate: channelMutate } = useSWR(
    userData
      ? `http://localhost:3095/api/workspaces/${talkspace}/channels`
      : null,
    fetcher
  );

  const onCreateChannel = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (!newChannel || !newChannel.trim()) return;
      axios
        .post(
          `http://localhost:3095/api/workspaces/${talkspace}/channels`,
          {
            name: newChannel,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setShow(false);
          setNewChannel("");
          channelMutate(response?.data, false);
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: "bottom-center" });
        });
    },
    [newChannel, talkspace, setShow, setNewChannel, channelMutate]
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
