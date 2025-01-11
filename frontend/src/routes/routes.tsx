import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import Home from "../components/Home";

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes;

