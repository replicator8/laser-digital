import ButtonNav from "./ButtonNav";
import './Header.css'

export default function Header({ onChange, active }) {
  return (
    <header>
      <h1>LASER DIGITAL</h1>
      <h3>
        ТЕХНИЧЕСКОЕ<br></br>ОБЕСПЕЧЕЧНИЕ<br></br>МЕРОПРИЯТИЙ
      </h3>
      <nav>
        <ButtonNav isActive={active === "main"} onClick={() => onChange("main")}>Главная</ButtonNav>
        <ButtonNav isActive={active === "equipment"} onClick={() => onChange("equipment")}>Оборудование</ButtonNav>
        <ButtonNav isActive={active === "request"} onClick={() => onChange("request")}>Заявки</ButtonNav>
        <ButtonNav isActive={active === "account"} onClick={() => onChange("account")}>Личный кабинет</ButtonNav>
      </nav>
      <div className="header-contacts">
        <p>г. Москва, ул. Минская, д 1г, к1. 121108</p>
        <p>+7 985 991 77 41</p>
      </div>
    </header>
  );
}
