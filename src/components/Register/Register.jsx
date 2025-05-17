import "./Register.css";
import ButtonSubmit from "../ButtonSubmit/ButtonSubmit";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";

export default function Register() {
  const { setLoginPage } = useContext(AuthContext);
  const { setRegisterPage } = useContext(AuthContext);
  const { setRole } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  function registerTapped() {
    if (
      email === "" ||
      password === "" ||
      !email.includes("@") ||
      password !== password2 ||
      name === "" ||
      phone === ""
    ) {
      setHasError(true);
      return;
    }

    axios
      .post(
        "http://localhost:8002/auth/register",
        {
          username: name,
          email: email,
          password: password,
          phone_number: phone,
        },
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        console.log(response);
        if (response.data.role === "user" || response.data.role === "admin") {
          console.log(response.data.role);
          setRegisterPage(false);
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

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handlePhoneChange(e) {
    setPhone(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handlePassword2Change(e) {
    setPassword2(e.target.value);
  }

  function handleOpenLogin() {
    setRegisterPage(false);
    setLoginPage(true);
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
            registerTapped();
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
            type="text"
            value={name}
            placeholder="ВВЕДИТЕ ВАШЕ ИМЯ"
            id="name"
            onChange={handleNameChange}
          />
          <input
            className="control"
            type="tel"
            value={phone}
            placeholder="ВВЕДИТЕ ВАШ ТЕЛЕФОН"
            id="phone"
            onChange={handlePhoneChange}
          />
          <input
            className="control"
            type="password"
            value={password}
            placeholder="ВВЕДИТЕ ПАРОЛЬ"
            id="password"
            onChange={handlePasswordChange}
          />
          <input
            className="control"
            type="password"
            value={password2}
            placeholder="ПОВТОРИТЕ ПАРОЛЬ"
            id="password2"
            onChange={handlePassword2Change}
          />
          <a onClick={() => handleOpenLogin()}>Вернуться ко входу</a>
          {hasError && <p className="error-msg-login">Неверные данные!</p>}
          {errorMsg && <p className="error-msg-login">{errorMsg}</p>}
          <ButtonSubmit>Регистрация</ButtonSubmit>
        </form>
      </section>
    </div>
  );
}
