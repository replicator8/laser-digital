import { createContext } from "react";

export const AuthContext = createContext({
  setLoginPage: () => {},
  setRegisterPage: () => {},
  setRole: () => {},
  setSkipLogin: () => {},
});
