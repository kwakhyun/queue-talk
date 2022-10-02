import { Route, Routes } from "react-router-dom";
import { Talkspace } from "../components/layouts/Talkspace";
import { Join } from "../pages/Join";
import { Login } from "../pages/Login";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />
      <Route path="/talkspace/:talkspace/*" element={<Talkspace />} />
    </Routes>
  );
};
