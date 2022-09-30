import { Route, Routes } from "react-router-dom";
import { Talkspace } from "../components/layouts/Talkspace";
import { Channel } from "../pages/Channel";
import { Join } from "../pages/Join";
import { Login } from "../pages/Login";
import { Main } from "../pages/Main";
import { Personal } from "../pages/Personal";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Talkspace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />
      <Route path="/:talkspace/dm/:id" element={<Personal />} />
      <Route path="/:talkspace/channel/:channel" element={<Channel />} />
    </Routes>
  );
};
