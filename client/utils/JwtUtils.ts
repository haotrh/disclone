import jwt, { JwtPayload } from "jsonwebtoken";

export namespace JwtUtils {
  export const isJwtExpired = (token: string) => {
    const currentTime = Math.round(Date.now() / 1000 + 60);
    const decoded = jwt.decode(token) as JwtPayload;

    if (decoded.exp) {
      const adjustedExpiry = decoded["exp"];

      if (adjustedExpiry < currentTime) {
        return true;
      }
      return false;
    }

    return true;
  };

  export const decode = (token: string) => {
    return jwt.decode(token);
  };
}
