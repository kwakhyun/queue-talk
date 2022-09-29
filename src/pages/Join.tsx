import styled from "@emotion/styled";
import axios from "axios";
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useInput } from "../hooks/useInput";

export const Join = () => {
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
        .post("http://localhost:3001/api/users", {
          email,
          nickname,
          password,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [email, nickname, password, passwordCheck]
  );

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
};

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
