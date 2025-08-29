import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Add your login logic here
    console.log("Login button clicked");

    let formRegisterData = new FormData();
    formRegisterData.append("username", username);
    formRegisterData.append("password", password);
    formRegisterData.append("email", email);
    formRegisterData.append("is_active", true);
    formRegisterData.append("is_staff", true);

    let formLoginData = new FormData();
    formLoginData.append("username", username);
    formLoginData.append("password", password);

    try {
      await axios({
        method: "post",
        url: "http://127.0.0.1:9001/api/createusers/",
        data: formRegisterData,
      }).then(async () => {
        secureLocalStorage.setItem("Username", username);
        await axios({
          method: "post",
          url: "http://127.0.0.1:9001/api/token/",
          data: formLoginData,
        })
          .then((response) => {
            secureLocalStorage.setItem("access_token", response.data.access);
            secureLocalStorage.setItem("refresh_token", response.data.refresh);
            navigate("/");
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } catch (error) {
      console.log(error.response.data);
      toast.error("Maybe User Already Exits and Enter Valid Details", {
        position: "bottom-right",
      });
      // console.error("Login failed",error)
    }
  };

  return (
    <div className="login-container">
      <h2>Register User</h2>
      <form>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* <input type="hidden" name="is_active" id='is_active' value={true} /> */}

        <button type="button" className="btn-btn" onClick={handleRegister}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
