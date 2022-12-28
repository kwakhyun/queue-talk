import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { StyledUserContainer } from "./Join";

import axios from "axios";
import useSWR from "swr";

import { useInput } from "../hooks/useInput";
import { fetcher } from "../utils/fetcher";

export const Login = memo(() => {
  const { data, error, mutate } = useSWR(
    `${process.env.REACT_APP_SERVER_URL}/api/users`,
    fetcher
  );

  const navigate = useNavigate();
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");

  const onSubmit = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}/api/users/login`,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          mutate(response.data, false);
        })
        .catch((error) => {
          const message = error.response.data;
          if (message === "존재하지 않는 이메일입니다!") {
            alert("가입되지 않은 이메일입니다.");
          } else if (message === "비밀번호가 틀렸습니다.") {
            alert("비밀번호가 틀렸습니다.");
          } else {
            alert("로그인에 실패했습니다.");
          }
        });
    },
    [email, password, mutate]
  );

  if (data) {
    navigate("/talkspace/sleact");
  }

  if (error) {
    alert("서버와 연결이 불안정합니다.");
  }

  return (
    <StyledUserContainer>
      <h1>QueueTalk</h1>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={email}
          onChange={onChangeEmail}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={password}
          onChange={onChangePassword}
        />
        <button type="submit">LOGIN</button>
        <button onClick={() => navigate("/join")}>JOIN</button>
      </form>
    </StyledUserContainer>
  );
});
