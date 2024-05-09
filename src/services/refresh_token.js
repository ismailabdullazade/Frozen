import { useGetRefreshAccessTokenMutation } from "../app/api/user.api";
import { useAuth } from "./auth";

const useTokenRefresh = () => {
  const [getToken] = useGetRefreshAccessTokenMutation();
  const auth = useAuth();

  const refresh = async () => {
    try {
      if (auth?.user) {
        const result = await getToken();
        localStorage.setItem("access_token", result.data.access_token);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  return {
    refresh,
  };
};

export default useTokenRefresh;
