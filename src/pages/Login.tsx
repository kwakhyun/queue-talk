import axios from "axios";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useInput } from "../hooks/useInput";
import { StyledUserContainer } from "./Join";

export const Login = () => {
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const navigate = useNavigate();

  const onSubmit = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      axios
        .post("http://localhost:3001/api/users/login", {
          email,
          password,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [email, password]
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
};
