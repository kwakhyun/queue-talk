import { Route, Routes } from "react-router-dom";
import { Main } from "../pages/Main";
import { Join } from "../pages/Join";
import { Login } from "../pages/Login";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/join" element={<Join />} />
      <Route path="/login" element={<Login />} />
      <Route path="/main" element={<Main />} />
    </Routes>
  );
};
