// Login.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";

const Login = () => {
  let navigate = useNavigate();
  useEffect(() => {
    if (secureLocalStorage.getItem("access_token")) {
      return navigate("/");
    }
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Add your login logic here
    console.log("Login button clicked");

    let formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await axios({
        method: "post",
        url: import.meta.env.VITE_APP_BASE_URL + "token/",
        data: formData,
      });
      // console.log(response.data.access)
      secureLocalStorage.setItem("access_token", response.data.access);
      if (secureLocalStorage.getItem("access_token")) {
        secureLocalStorage.setItem("Username", username);
        toast.success(`Welcome ${username}`.toUpperCase(), {
          position: "bottom-right",
        });
        return navigate("/");
      }
    } catch (error) {
      toast.error("Incorrect Username or Password", {
        position: "bottom-right",
      });
      return navigate("/login");
      // console.error("Login failed",error)
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="button" className="btn-btn" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
