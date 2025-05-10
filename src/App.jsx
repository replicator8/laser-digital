import "./index.css";
import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import Main from "./components/Main/Main";
import Equipment from "./components/Equipment/Equipment";
import Request from "./components/Request/Request";
import Account from "./components/Account/Account";
import CategoryInfo from "./components/CategoryInfo/CategoryInfo";
import axios from "axios";

export default function App() {
  const [tab, setTab] = useState("main");

  const login = useCallback(async () => {
    axios
      .post(
        "http://localhost:8002/auth/login",
        {
          email: "test@example.com",
          password: "test1234",
        },
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        console.log(response);
      });
  }, []);

  useEffect(() => {
    login();
  }, [login]);

  return (
    <>
      <Header onChange={(current) => setTab(current)} active={tab} />
      <main>
        {tab === "main" && <Main />}
        {tab === "equipment" && <Equipment />}
        {tab === "request" && <Request />}
        {tab === "account" && <Account />}
        {tab === "category-info" && <CategoryInfo />}
      </main>
      <Footer />
    </>
  );
}
