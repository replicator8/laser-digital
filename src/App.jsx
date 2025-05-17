import "./index.css";
import { useState } from "react";
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

export default function App() {
  const [tab, setTab] = useState("main");
  const [loginPage, setLoginPage] = useState(true);
  const [registerPage, setRegisterPage] = useState(false);
  const [role, setRole] = useState("user");

  return (
    <>
      <AuthContext.Provider value={{ setLoginPage, setRegisterPage, setRole }}>
        {!loginPage && !registerPage && (
          <>
            <Header onChange={(current) => setTab(current)} active={tab} />
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
        {loginPage && <Login />}
        {registerPage && <Register />}
      </AuthContext.Provider>
    </>
  );
}
