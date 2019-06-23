import React from "react";
import { Redirect } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function Login() {
  if (localStorage.getItem("t-at")) {
    return <Redirect to="/" />;
  }

  return <LoginForm />;
}

export default Login;
