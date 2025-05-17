import "./Account.css";
import AccountRow from "./AccountRow";
import { useEffect, useCallback, useState, useContext } from "react";
import axios from "axios";
import ButtonSubmit from "../ButtonSubmit/ButtonSubmit";
import { AuthContext } from "../AuthContext";

export default function Account() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { setLoginPage } = useContext(AuthContext);

  const getUser = useCallback(async () => {
    axios
      .get("http://localhost:8002/auth/users/me/", {
        withCredentials: true,
      })
      .then((response) => {
        const user = response.data;
        console.log("User data:", user);
        setName(user.username);
        setEmail(user.email);
        setPhone(user.phone_number);
      })
      .catch((error) => {
        console.error(
          "Error fetching user data:",
          error.response?.data || error.message
        );
      });
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  function logout() {
    axios
      .post(
        "http://localhost:8002/auth/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        console.log(response);
        setLoginPage(true);
      });
  }

  return (
    <section className="center">
      <AccountRow body={name}>Имя</AccountRow>
      <AccountRow body={email}>Email</AccountRow>
      <AccountRow body={phone}>Телефон</AccountRow>

      <ButtonSubmit onClick={() => logout()}>Выйти из профиля</ButtonSubmit>
    </section>
  );
}
