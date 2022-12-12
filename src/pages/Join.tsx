import { useState, useCallback, memo } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "@emotion/styled";

import axios from "axios";
import useSWR from "swr";

import { useInput } from "../hooks/useInput";
import { fetcher } from "../utils/fetcher";

export const Join = memo(() => {
  const { data, error } = useSWR(
    `${process.env.REACT_APP_SERVER_URL}/api/users`,
    fetcher,
    {
      dedupingInterval: 5000,
    }
  );

  const navigate = useNavigate();
  const [email, onChangeEmail] = useInput("");
  const [nickname, onChangeNickname] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [passwordCheck, onChangePasswordCheck] = useInput("");
  const [mismatchError, setMismatchError] = useState(false);

  const onSubmit = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (password !== passwordCheck) {
        return setMismatchError(true);
      }
      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/api/users`, {
          email,
          nickname,
          password,
        })
        .then(() => {
          alert("회원가입이 완료되었습니다.");
          navigate("/login");
        })
        .catch((error) => {
          console.log(error);
          alert("회원가입에 실패했습니다.");
        });
    },
    [email, nickname, password, passwordCheck, navigate]
  );

  if (data) {
    navigate("/talkspace/sleact");
  }

  if (error) {
    alert("서버와 연결이 불안정합니다.");
  }

  return (
    <StyledUserContainer>
      <h1>OurTalk</h1>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={email}
          onChange={onChangeEmail}
        />
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={nickname}
          onChange={onChangeNickname}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={password}
          onChange={onChangePassword}
        />
        <input
          type="password"
          name="passwordCheck"
          placeholder="비밀번호 확인"
          value={passwordCheck}
          onChange={onChangePasswordCheck}
        />
        {mismatchError && (
          <div className="error-message">비밀번호가 일치하지 않습니다.</div>
        )}
        <button type="submit">가입하기</button>
      </form>
      <div className="link-div">
        <span>이미 계정이 있으신가요? </span>
        <Link to="/login">로그인하기</Link>
      </div>
    </StyledUserContainer>
  );
});

export const StyledUserContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    input {
      width: 300px;
      height: 40px;
      margin-bottom: 1rem;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 0.5rem;
      font-size: 1rem;
    }
    button {
      width: 300px;
      height: 40px;
      margin-bottom: 1rem;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 0.5rem;
      font-size: 1rem;
      background: #343a40;
      color: #fff;
      cursor: pointer;
    }
  }
  .error-message {
    color: red;
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }
  .link-div {
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      margin-right: 0.5rem;
    }
    a {
      color: #343a40;
    }
  }
`;
