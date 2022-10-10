import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_PATH,
});

let refreshTokenPromise: Promise<string | undefined> | null;

const refreshToken = () => getSession().then((session) => session?.accessToken);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.config && error.response && error.response.status === 401) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshToken().then((token) => {
          refreshTokenPromise = null; // clear state
          token && setToken(token);
          return token; // resolve with the new token
        });
      }

      return refreshTokenPromise.then((token) => {
        error.config.headers["Authorization"] = `Bearer ${token}`;
        return api.request(error.config);
      });
    }
    return Promise.reject(error);
  }
);

export const setToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default api;
