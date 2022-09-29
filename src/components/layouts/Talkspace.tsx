import axios from "axios";
import { PropsWithChildren, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "../../utils/fetcher";

export const Talkspace = ({ children }: PropsWithChildren) => {
  const { data, error, mutate } = useSWR(
    "http://localhost:3095/api/users",
    fetcher
  );

  const navigate = useNavigate();

  const onLogout = useCallback(() => {
    axios
      .post("http://localhost:3095/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false, false);
      });
  }, [mutate]);

  if (data === undefined) {
    return <div>로딩중...</div>;
  }
  if (!data) navigate("/login");
  if (error) alert("서버와 연결이 불안정합니다.");

  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};
