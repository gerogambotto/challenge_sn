import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage/HomePage.jsx";
import { LoginPage } from "./pages/LoginPage/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage.jsx";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/HomePage" element={<HomePage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
