import styled from "@emotion/styled";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Talkspace } from "../components/layouts/Talkspace";

export const Main = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/lol/channel/일반");
  }, [navigate]);

  return (
    <Talkspace>
      <h1>메인 페이지</h1>
    </Talkspace>
  );
};
