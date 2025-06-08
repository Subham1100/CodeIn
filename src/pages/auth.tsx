import { useState } from "react";
import { useAuth } from "../context/AuthProvider.js";
import "./css/auth.css";

const Auth = () => {
  const { login, register } = useAuth();

  const [isLoginPage, setIsLoginPage] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (isLoginPage) {
      login(email, password);
    } else {
      setIsLoginPage(true);
    }
  };

  const handleRegister = () => {
    if (!isLoginPage) {
      register(username, email, password);
    } else {
      setIsLoginPage(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 font-poppins">
      <div className="bg-white shadow-lg rounded-3xl flex flex-col md:flex-row w-[90%] max-w-5xl overflow-hidden">
        <div className="md:w-1/2 bg-blue-800 flex flex-col items-center justify-center p-8 text-white">
          <p className="text-2xl font-semibold font-mono">Be Verified</p>
        </div>

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

export default Auth;
