import "./Login.css";
import ButtonSubmit from "../ButtonSubmit/ButtonSubmit";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";

export default function Login() {
  const { setLoginPage } = useContext(AuthContext);
  const { setRegisterPage } = useContext(AuthContext);
  const { setRole } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  function loginTapped() {
    if (email === "" || password === "" || !email.includes("@")) {
      setHasError(true);
      return;
    }

    axios
      .post(
        "http://localhost:8002/auth/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        console.log(response);
        if (response.data.role === "user" || response.data.role === "admin") {
          setLoginPage(false);
          setRole(response.data.role);
        }
      })
      .catch(function (error) {
        setErrorMsg(error.response.data.detail[0].msg);
        console.log(error.response.data.detail[0].msg);
      });
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handeOpenRegister() {
    setLoginPage(false);
    setRegisterPage(true);
  }

  return (
    <div className="login-page-back">
      <section className="login-page">
        <h1 className="login-title">
          LASER <span>DIGITAL</span>
        </h1>
        <form
          className="form-login"
          onSubmit={(e) => {
            e.preventDefault();
            loginTapped();
          }}
        >
          <input
            className="control"
            type="text"
            value={email}
            placeholder="ВВЕДИТЕ EMAIL"
            id="email"
            onChange={handleEmailChange}
          />
          <input
            className="control"
            type="password"
            value={password}
            placeholder="ВВЕДИТЕ ПАРОЛЬ"
            id="password"
            onChange={handlePasswordChange}
          />
          <a onClick={() => handeOpenRegister()}>
            Нет аккаунта? Зарегистрируйтесь!
          </a>
          {hasError && <p className="error-msg-login">Неверные данные!</p>}
          {errorMsg && <p className="error-msg-login">{errorMsg}</p>}
          <ButtonSubmit>Вход</ButtonSubmit>
        </form>
      </section>
    </div>
  );
}
