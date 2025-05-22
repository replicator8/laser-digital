import "./index.css";
import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import Main from "./components/Main/Main";
import Equipment from "./components/Equipment/Equipment";
import Request from "./components/Request/Request";
import Account from "./components/Account/Account";
import CategoryInfo from "./components/CategoryInfo/CategoryInfo";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { AuthContext } from "./components/AuthContext";
import AdminRequest from "./components/AdminRequest/AdminRequest";
import axios from "axios";

export default function App() {
  const [tab, setTab] = useState("main");
  const [loginPage, setLoginPage] = useState(true);
  const [registerPage, setRegisterPage] = useState(false);
  const [role, setRole] = useState("user");
  const [skipLogin, setSkipLogin] = useState(false);

  const checkToken = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8002/auth/check_refresh_token",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setSkipLogin(true);
        if (response.data.role === "admin") {
          setRole("admin");
        }
      } else if (response.status !== 200) {
        setSkipLogin(false);
      }
    } catch (error) {
      console.error(
        "Error checking token:",
        error.response?.data || error.message
      );
    }
  }, []);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  function changeTab(current) {
    setTab(current);
  }

  return (
    <>
      <AuthContext.Provider
        value={{ setLoginPage, setRegisterPage, setRole, setSkipLogin }}
      >
        {((skipLogin && loginPage) || (!loginPage && !registerPage)) && (
          <>
            <Header onChange={(current) => changeTab(current)} active={tab} />
            <main>
              {tab === "main" && <Main />}
              {tab === "equipment" && <Equipment />}
              {tab === "request" && role === "user" && <Request />}
              {tab === "request" && role === "admin" && <AdminRequest />}
              {tab === "account" && <Account />}
              {tab === "category-info" && <CategoryInfo />}
            </main>
            <Footer />{" "}
          </>
        )}
        {loginPage && !skipLogin && <Login />}
        {registerPage && <Register />}
      </AuthContext.Provider>
    </>
  );
}
