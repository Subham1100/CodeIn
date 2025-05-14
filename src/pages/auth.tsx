import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logEvent, LogLevel } from "../utils/logger";
import "./css/auth.css";
import axios from "axios";

const auth = () => {
  const navigate = useNavigate();
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const goToRooms = () => {
    try {
      logEvent("CTA_Clicked", {
        location: "Hero Section",
        button: "Get Started",
      });
      navigate("/rooms");
      logEvent("Navigation_Success", { to: "/rooms" });
    } catch (error) {
      logEvent(
        "Navigation_Failure",
        { to: "/rooms", error: getErrorMessage(error) },
        LogLevel.ERROR
      );
    }
  };

  const handleLogin = () => {
    if (isLoginPage) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/database/api/user/login`, {
          email: email,
          password: password,
        })
        .then((response) => {
          LogLevel.INFO;
          console.log(response);
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            navigate("/rooms");
            LogLevel.INFO;
          } else {
            LogLevel.ERROR;
            console.error("Token not found in response.");
          }
        })
        .catch((error) => {
          LogLevel.ERROR;
          console.error("error :", error);
        });
    } else {
      setIsLoginPage(true);
    }
  };
  const handleRegister = () => {
    if (!isLoginPage) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/database/api/user/register`, {
          username: username,
          email: email,
          password: password,
        })
        .then((response) => {
          LogLevel.INFO;
          console.log(response);
        })
        .catch((error) => {
          LogLevel.ERROR;
          console.error("error :", error);
        });
    } else {
      setIsLoginPage(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 font-poppins">
      <div className="bg-white shadow-lg rounded-3xl flex flex-col md:flex-row w-[90%] max-w-5xl overflow-hidden">
        {/* Left Box */}
        <div className="md:w-1/2 bg-blue-800 flex flex-col items-center justify-center p-8 text-white">
          <p className="text-2xl font-semibold font-mono">Be Verified</p>
        </div>

        {/* Right Box */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-3xl font-semibold">Welcome To CodeIn</h2>
            <p className="text-gray-600">We are happy to have you back.</p>
          </div>
          {!isLoginPage && (
            <input
              type="text"
              placeholder="Username"
              className="mb-3 p-3 w-full rounded bg-gray-100 text-base outline-none"
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <input
            type="text"
            placeholder="Email address"
            className="mb-3 p-3 w-full rounded bg-gray-100 text-base outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-3 p-3 w-full rounded bg-gray-100 text-base outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-between items-center mb-5 text-sm">
            <a href="#" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            className="bg-blue-600 text-white w-full py-3 rounded mb-3 hover:bg-blue-700"
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            className="bg-white border w-full py-3 rounded flex justify-center items-center gap-2 mb-3 hover:bg-gray-50"
            onClick={handleRegister}
          >
            <span className="text-sm">Register</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default auth;
function getErrorMessage(error: unknown) {
  throw new Error("Function not implemented.");
}
