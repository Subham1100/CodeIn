import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useErrorRedirect = (
  condition: boolean | undefined,
  message: string | undefined,
  timeout: number = 15000
) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (condition === false) {
      const timer = setTimeout(() => {
        navigate("/error", { state: { message } });
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [condition, message, timeout, navigate]);
};

export default useErrorRedirect;
