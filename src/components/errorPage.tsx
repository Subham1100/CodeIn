// src/pages/ErrorPage.tsx

import { useLocation } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();
  const message = location.state?.message || "An unknown error occurred.";

  return (
    <div className="text-center text-white bg-gray-900 h-screen flex items-center justify-center">
      <h1 className="text-2xl font-semibold">{message}</h1>
    </div>
  );
};

export default ErrorPage;
