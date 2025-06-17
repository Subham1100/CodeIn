import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider.js";
import { User, Mail, Lock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { login, register } = useAuth();

  const [isLoginPage, setIsLoginPage] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [textConfirm, setTextConfirm] = useState(
    "We are happy to have you back."
  );
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Make the authenticated request
      const authenticationHeader = {
        Authorization: token,
      };

      axios
        .get(`${import.meta.env.VITE_API_URL}/database/api/user/profile/`, {
          headers: authenticationHeader,
        })
        .then((response) => {
          setUser(response.data.user);
          setIsAuthenticated(true);
          navigate("/rooms");
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setIsAuthenticated(false);
        });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    async function init() {
      // Try to refresh token first
      const newAccessToken = await getNewAccessToken();

      if (newAccessToken) {
        // Make the authenticated request
        axios
          .get(`${import.meta.env.VITE_API_URL}/database/api/user/profile/`, {
            headers: {
              Authorization: newAccessToken,
            },
          })
          .then((response) => {
            setUser(response.data.user);
            setIsAuthenticated(true);
            navigate("/rooms");
          })
          .catch((error) => {
            console.error("Error fetching user profile:", error);
            setIsAuthenticated(false);
          });
      } else {
        setIsAuthenticated(false);
      }
    }

    async function getNewAccessToken() {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/database/api/user/refresh`,
          {},
          {
            withCredentials: true, // Send the cookie
          }
        );

        const data = res.data;

        if (res.status === 200 && data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          return data.accessToken;
        } else {
          throw new Error(data.message || "Refresh failed");
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
        return null;
      }
    }

    init();
  }, []);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const toggleForm = () => {
    setIsLoginPage((prev) => !prev);
    resetForm();
    setTextConfirm(
      isLoginPage
        ? "Create your account to get started."
        : "We are happy to have you back."
    );
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isLoginPage) {
      login(email, password);
    } else {
      try {
        await register(username, email, password);
        setTextConfirm("Registered Successfully. Login with your credentials.");
        setIsLoginPage(true);
        setPassword("");
      } catch (err) {
        setTextConfirm("Cannot register user currently.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  font-poppins bg-gradient-to-b from-[#faf0e6] via-[#faf0e6]  to-[#ba96a6]">
      <div className="fixed inset-0 z-60 bg-black text-white flex items-center justify-center text-center px-4 md:hidden">
        <p className="text-lg font-semibold">
          Currently not available for mobile screen
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-3xl flex flex-col md:flex-row w-[60%] max-w-5xl overflow-hidden left-0 h-120">
        <div
          className={`md:w-1/2  flex flex-col items-center justify-center p-8 text-white transition-colors duration-800 ease-in-out ${
            isLoginPage ? "bg-[#b3a79b]" : "bg-[#4b3b42]"
          }`}
        >
          {isLoginPage ? (
            <div className="flex flex-col gap-5 items-center text-black">
              <p className="text-3xl">New here?</p>
              <p className="font-medium tracking-wide text-center">
                Get exclusive access to our coolest features sign up now and
                start exploring a whole new world!
              </p>
              <button
                onClick={toggleForm}
                className="p-4 w-1/2 bg-[#3c3630d6] text-white rounded-2xl"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5 items-center">
              <p className="text-3xl">Already have an account?</p>
              <p className="font-medium tracking-wide text-center">
                Log in to access your sessions, projects, and collaborative
                tools instantly.
              </p>
              <button
                onClick={toggleForm}
                className="p-4 w-1/2 bg-[#8d757fa1] text-white rounded-2xl"
              >
                Login
              </button>
            </div>
          )}
        </div>

        <div
          className="md:w-1/2 p-10 flex flex-col justify-center  "
          style={{ backgroundColor: isLoginPage ? "#d3c4b5ae" : "#b09da586" }}
        >
          <div className="mb-6">
            <h2 className="text-4xl font-semibold">Welcome To CodeIn</h2>
            <p className="text-gray-600">{textConfirm}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!isLoginPage && (
              <div className=" bg-white flex rounded-2xl p-2">
                <User className="bg-white h-10" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="p-3 w-full rounded text-base  bg-transparent outline-none"
                />
              </div>
            )}
            <div className=" bg-white flex rounded-2xl p-2">
              <Mail className="bg-white h-10" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 w-full rounded bg-transparent text-base  outline-none"
                required
              />
            </div>
            <div className=" bg-white flex rounded-2xl p-2">
              <Lock className="bg-white h-10" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className=" p-3 w-full rounded bg-transparent text-base outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className={` text-white w-full py-3 rounded-2xl mb-3 transition-colors duration-800 ease-in-out ${
                isLoginPage ? "bg-[#3c3630d6]" : "bg-[#4b3b42]"
              }`}
            >
              {isLoginPage ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
