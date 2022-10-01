import axios from "axios";
import { FC, useCallback } from "react";
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

export const CreateTalkspace: FC<IProps> = ({
  show,
  setShow,
  onCloseModal,
}) => {
  const [newTalkspace, onChangeNewTalkspace, setNewTalkspace] = useInput("");
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput("");

  const { data: userData, mutate } = useSWR(
    "http://localhost:3095/api/users",
    fetcher
  );

  const onCreateTalkspace = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (!newTalkspace || !newTalkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(
          "http://localhost:3095/api/workspaces",
          {
            workspace: newTalkspace,
            url: newUrl,
          },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          setShow(false);
          setNewTalkspace("");
          setNewUrl("");
          mutate(userData);
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: "bottom-center" });
        });
    },
    [newTalkspace, newUrl, setNewTalkspace, setNewUrl, setShow, mutate, userData]
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateTalkspace}>
        <label id="workspace-label">
          <span>채팅 주제 이름</span>
          <input
            name="workspace"
            type="text"
            value={newTalkspace}
            onChange={onChangeNewTalkspace}
          />
        </label>
        <label id="workspace-url-label">
          <span>채팅 주제 url</span>
          <input
            name="workspace"
            type="text"
            value={newUrl}
            onChange={onChangeNewUrl}
          />
        </label>
        <button type="submit">생성하기</button>
      </form>
    </Modal>
  );
};
