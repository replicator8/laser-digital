import "./Request.css";
import Popup from "../Popup/Popup"
import ActiveRequest from "../ActiveRequest";
import ArchiveRequest from "../ArchiveRequest";
import ButtonSubmit from "../ButtonSubmit/ButtonSubmit";
import { useState, useEffect, useCallback } from "react";
import axios, { isAxiosError } from "axios";
import Modal from "../Modal/Modal";

export default function Request() {
  const [showPopup, setShowPopup] = useState(false);
  const [activeRequests, setActiveRequests] = useState([]);
  const [archiveRequests, setArchiveRequests] = useState([]);
  const [selectedActiveEventDetails, setSelectedActiveEventDetails] =
    useState(null);
  const [selectedArchiveEventDetails, setSelectedArchiveEventDetails] =
    useState(null);
  const [modal, setModal] = useState(false);
  const [modalArchive, setModalArchive] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [dtStart, setDtStart] = useState("");
  const [dtEnd, setDtEnd] = useState("");
  const [type, setType] = useState("концерт");
  const [name, setName] = useState("");
  const [plan, setPlan] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("ип");
  const [square, setSquare] = useState(1);
  const [height, setHeight] = useState(1);
  const [isRecord, setIsRecord] = useState("false");
  const [minTime, setMinTime] = useState(1);
  const [power, setPower] = useState(1);
  const [isDownTime, setIsDownTime] = useState("false");
  const [comment, setComment] = useState("");
  const [hasError, setHasError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetForm = () => {
    setDtStart("");
    setDtEnd("");
    setType("концерт");
    setName("");
    setPlan("");
    setAddress("");
    setPayment("ип");
    setSquare(1);
    setHeight(1);
    setIsRecord("false");
    setMinTime(1);
    setPower(1);
    setIsDownTime("false");
    setComment("");
    setHasError(false);
    setIsSubmitted(false);
  };

  const getActiveRequests = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8002/events/get_active",
        {
          withCredentials: true,
        }
      );
      setActiveRequests(response.data.events);
    } catch (error) {
      console.error(
        "Error fetching active requests:",
        error.response?.data || error.message
      );
    }
  }, []);

  const getArchiveRequests = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8002/events/get_archive",
        {
          withCredentials: true,
        }
      );
      setArchiveRequests(response.data.events);
    } catch (error) {
      console.error(
        "Error fetching archive requests:",
        error.response?.data || error.message
      );
    }
  }, []);

  useEffect(() => {
    getActiveRequests();
    getArchiveRequests();
  }, [getActiveRequests, getArchiveRequests]);

  const handleActiveRequestClick = useCallback(async (eventId) => {
    try {
      const response = await axios.get(
        `http://localhost:8002/events/get_active/${eventId}`,
        {
          withCredentials: true,
        }
      );
      setSelectedActiveEventDetails(response.data);
      setModalActive(true);
    } catch (error) {
      console.error("Ошибка получения деталей заявки:", error);
    }
  }, []);

  const handleArchiveRequestClick = useCallback(async (eventId) => {
    try {
      const response = await axios.get(
        `http://localhost:8002/events/get_archive/${eventId}`,
        {
          withCredentials: true,
        }
      );
      setSelectedArchiveEventDetails(response.data);
      setModalArchive(true);
    } catch (error) {
      console.error("Ошибка получения деталей заявки:", error);
    }
  }, []);

  function createRequest(e) {
    handleShowPopup()
    e.preventDefault();
    setIsSubmitted(true);

    if (!dtStart || !dtEnd || !name || !address) {
      setHasError("Заполните обязательные поля");
      return;
    }

    setHasError(null);

    axios
      .post(
        "http://localhost:8002/events/add",
        {
          event_date: dtStart,
          event_end_date: dtEnd,
          title: name,
          type: type,
          area_plan: plan,
          address: address,
          payment_method: payment,
          comment: comment,
          site_area: square,
          ceiling_height: height,
          has_tv: isRecord,
          min_install_time: minTime,
          total_power: power,
          has_downtime: isDownTime,
          estimate: 999,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then(() => {
        getActiveRequests();
        setModal(false);
        resetForm();
        handleShowPopup();
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.detail
          ) {
            setHasError(error.response.data.detail);
          } else {
            setHasError("Произошла ошибка при отправке заявки");
          }
        } else {
          setHasError("Произошла неожиданная ошибка");
        }
      });
  }

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <section style={{ marginLeft: "20px" }}>
      <h1 className="r-title">
        Мои <span>заявки</span> ({activeRequests.length})
      </h1>
      <div className="active-requests">
        <div className="create-request">
          <button className="add-btn" onClick={() => setModal(true)}>
            <img src="src/photo/plus.svg" alt="add..." />
          </button>
        </div>
        {activeRequests.map((event) => (
          <div
            key={event.event_id}
            onClick={() => handleActiveRequestClick(event.event_id)}
            style={{ cursor: "pointer" }}
            className="active-r"
          >
            <ActiveRequest activeEvent={event} />
          </div>
        ))}
      </div>

      {selectedActiveEventDetails && console.log(selectedActiveEventDetails)}

      <h1 className="r-title">
        Архивные <span>заявки</span> ({archiveRequests.length})
      </h1>
      <div className="archive-requests">
        {archiveRequests.map((event) => (
          <div
            key={event.event_id}
            onClick={() => handleArchiveRequestClick(event.event_id)}
            style={{ cursor: "pointer" }}
            className="archive-r"
          >
            <ArchiveRequest archiveEvent={event} />
          </div>
        ))}
      </div>

      <Popup
        message="Заявка успешно создана!"
        isVisible={showPopup}
        onClose={handleClosePopup}
      />

      <Modal open={modal}>
        <div className="modal-h">
          <h3 className="cr-title">Оформить заявку</h3>
          <button className="m-close-btn" onClick={() => setModal(false)}>
            <img
              src="src/photo/close.svg"
              alt="close"
              className="m-close-photo"
            />
          </button>
        </div>

        <form className="create-event-form" onSubmit={createRequest}>
          <label htmlFor="dtStart">Дата начала</label>
          <input
            type="datetime-local"
            id="dtStart"
            className="control"
            value={dtStart}
            style={{
              border: isSubmitted && !dtStart ? "1px solid red" : "",
            }}
            onChange={(e) => setDtStart(e.target.value.replace("T", " "))}
          />
          <label htmlFor="dtEnd">Дата окончания</label>
          <input
            type="datetime-local"
            id="dtEnd"
            className="control"
            value={dtEnd}
            style={{
              border: isSubmitted && !dtEnd ? "1px solid red" : "",
            }}
            onChange={(e) => setDtEnd(e.target.value.replace("T", " "))}
          />
          <label htmlFor="type">Тип мероприятия</label>
          <select
            name=""
            id="type"
            className="control"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="концерт">Концерт</option>
            <option value="свадьба">Свадьба</option>
            <option value="корпоратив">Корпоратив</option>
            <option value="день рождения">День рождения</option>
          </select>
          <label htmlFor="name">Наименование мероприятия</label>
          <input
            type="text"
            id="name"
            className="control"
            value={name}
            style={{
              border: isSubmitted && !name ? "1px solid red" : "",
            }}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="file">План помещения</label>
          <input
            type="file"
            id="file"
            className="control"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          />
          <label htmlFor="address">Адрес проведения мероприятия</label>
          <input
            type="text"
            id="address"
            className="control"
            value={address}
            style={{
              border: isSubmitted && !address ? "1px solid red" : "",
            }}
            onChange={(e) => setAddress(e.target.value)}
          />
          <label htmlFor="payment">Вариант оплаты</label>
          <select
            name=""
            id="payment"
            className="control"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          >
            <option value="ип">ИП</option>
            <option value="ооо">ООО</option>
            <option value="физ. лицо">Физ. лицо</option>
          </select>
          <label htmlFor="square">Площадь площадки, м^2</label>
          <input
            type="number"
            id="square"
            className="control"
            value={square}
            min="1"
            onChange={(e) => setSquare(e.target.value)}
          />
          <label htmlFor="height">высота потолка, м</label>
          <input
            type="number"
            id="height"
            className="control"
            value={height}
            min="1"
            onChange={(e) => setHeight(e.target.value)}
          />
          <label htmlFor="isRecord">будет ли телесъемка?</label>
          <select
            name=""
            id="isRecord"
            className="control"
            value={isRecord}
            onChange={(e) => setIsRecord(e.target.value)}
          >
            <option value={false}>Нет</option>
            <option value={true}>Да</option>
          </select>
          <label htmlFor="minTime">минимальное время для монтажа, ч</label>
          <input
            type="number"
            id="minTime"
            className="control"
            value={minTime}
            min="0"
            onChange={(e) => setMinTime(e.target.value)}
          />
          <label htmlFor="power">доступная мощность электричества, кВТ</label>
          <input
            type="number"
            id="power"
            className="control"
            value={power}
            min="0"
            onChange={(e) => setPower(e.target.value)}
          />
          <label htmlFor="isDownTime">
            Будет ли простой? Если да, то укажите дни в поле комментарий
          </label>
          <select
            name=""
            id="isDownTime"
            className="control"
            value={isDownTime}
            onChange={(e) => setIsDownTime(e.target.value)}
          >
            <option value={false}>Нет</option>
            <option value={true}>Да</option>
          </select>
          <label htmlFor="comment">Комментарий</label>
          <textarea
            type="text"
            id="comment"
            className="control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="cr-footer">
            {isSubmitted && (!dtStart || !dtEnd || !name || !address) && (
              <p style={{ color: "red" }}>
                Пожалуйста, заполните все обязательные поля
              </p>
            )}
            <ButtonSubmit style={{ width: "230px" }}>
              Отправить заявку
            </ButtonSubmit>
          </div>
          {/* <pre>{JSON.stringify({ hasError, isSubmitted }, null, 2)}</pre> */}
        </form>
      </Modal>

      <Modal open={modalActive}>
        <div className="modal-h">
          <h3 className="cr-title">{selectedActiveEventDetails?.title}</h3>
          <button className="m-close-btn" onClick={() => setModalActive(false)}>
            <img
              src="src/photo/close.svg"
              alt="close"
              className="m-close-photo"
            />
          </button>
        </div>
        <form className="create-event-form">
          <label htmlFor="dtStart">Дата начала</label>
          <input
            type="datetime-local"
            id="dtStart"
            className="control"
            value={selectedActiveEventDetails?.event_date}
            disabled={true}
          />
          <label htmlFor="dtEnd">Дата окончания</label>
          <input
            type="datetime-local"
            id="dtEnd"
            className="control"
            value={selectedActiveEventDetails?.event_end_date}
            disabled={true}
          />
          <label htmlFor="type">Тип мероприятия</label>
          <select
            name=""
            id="type"
            className="control"
            value={selectedActiveEventDetails?.type || ""}
            disabled={true}
          >
            <option value="концерт">Концерт</option>
            <option value="свадьба">Свадьба</option>
            <option value="корпоратив">Корпоратив</option>
            <option value="день рождения">День рождения</option>
          </select>
          <label htmlFor="name">Наименование мероприятия</label>
          <input
            type="text"
            id="name"
            className="control"
            value={selectedActiveEventDetails?.title}
            disabled={true}
          />
          <label htmlFor="file">План помещения</label>
          <input type="file" id="file" className="control" disabled={true} />
          <label htmlFor="address">Адрес проведения мероприятия</label>
          <input
            type="text"
            id="address"
            className="control"
            value={selectedActiveEventDetails?.address}
            disabled={true}
          />
          <label htmlFor="payment">Вариант оплаты</label>
          <select
            name=""
            id="payment"
            className="control"
            value={selectedActiveEventDetails?.payment_method || ""}
            disabled={true}
          >
            <option value="ип">ИП</option>
            <option value="ооо">ООО</option>
            <option value="физ. лицо">Физ. лицо</option>
          </select>
          <label htmlFor="square">Площадь площадки, м^2</label>
          <input
            type="number"
            id="square"
            className="control"
            value={selectedActiveEventDetails?.site_area}
            disabled={true}
          />
          <label htmlFor="height">высота потолка, м</label>
          <input
            type="number"
            id="height"
            className="control"
            value={selectedActiveEventDetails?.ceiling_height}
            disabled={true}
          />
          <label htmlFor="isRecord">будет ли телесъемка?</label>
          <select
            name=""
            id="isRecord"
            className="control"
            value={selectedActiveEventDetails?.has_tv || ""}
            disabled={true}
          >
            <option value={false}>Нет</option>
            <option value={true}>Да</option>
          </select>
          <label htmlFor="minTime">минимальное время для монтажа, ч</label>
          <input
            type="number"
            id="minTime"
            className="control"
            value={selectedActiveEventDetails?.min_install_time}
            disabled={true}
          />
          <label htmlFor="power">доступная мощность электричества, кВТ</label>
          <input
            type="number"
            id="power"
            className="control"
            value={selectedActiveEventDetails?.total_power}
            disabled={true}
          />
          <label htmlFor="isDownTime">
            Будет ли простой? Если да, то укажите дни в поле комментарий
          </label>
          <select
            name=""
            id="isDownTime"
            className="control"
            value={selectedActiveEventDetails?.has_downtime || ""}
            disabled={true}
          >
            <option value={false}>Нет</option>
            <option value={true}>Да</option>
          </select>
          <label htmlFor="comment">Комментарий</label>
          <textarea
            type="text"
            id="comment"
            className="control"
            value={selectedActiveEventDetails?.comment}
            disabled={true}
          />
          <label htmlFor="manager">
            <span>имя менеджера</span>
          </label>
          <input
            type="text"
            id="manager"
            className="control"
            value={selectedActiveEventDetails?.manager_name}
            disabled={true}
          />
          <label htmlFor="tel">
            <span>Номер телефона менеджера</span>
          </label>
          <input
            type="tel"
            id="tel"
            className="control"
            value={selectedActiveEventDetails?.manager_phone_number}
            disabled={true}
          />
        </form>
        <p className="eq-ar">
          <span>Приборы:</span>
        </p>
        <ul>
          {selectedActiveEventDetails?.equipment.map((eq) => (
            <li key={Math.random()}>{eq}</li>
          ))}
        </ul>
        <br />
        <h3 className="eq-ar">
          <span>
            Итоговая смета: {selectedActiveEventDetails?.estimate} руб.
          </span>
        </h3>
        <h3 className="eq-ar">
          <span>Скидка: {selectedActiveEventDetails?.discount * 100}%</span>
        </h3>
      </Modal>

      <Modal open={modalArchive} isArchive={true}>
        <div className="modal-h">
          <h3 style={{ color: "#fff" }} className="cr-title">
            <span>Название:</span> {selectedArchiveEventDetails?.title}
          </h3>
          <button
            className="m-close-btn"
            onClick={() => setModalArchive(false)}
          >
            <img
              src="src/photo/close.svg"
              alt="close"
              className="m-close-photo"
            />
          </button>
        </div>
        <div className="content-arc">
          <div className="left-arc">
            <h2 style={{ marginBottom: "0.5rem" }}>
              <span>
                Кратко о <br />
                мероприятии:
              </span>
            </h2>
            <h3>Дата мероприятия: {selectedArchiveEventDetails?.event_date}</h3>
            <h3>Место проведения: {selectedArchiveEventDetails?.address}</h3>
            <h3>
              Количество приборов:{" "}
              {selectedArchiveEventDetails?.equipment_count}
            </h3>
            <h3>Общая мощность: {selectedArchiveEventDetails?.total_power}</h3>
            <h3>
              Художник по свету:{" "}
              {selectedArchiveEventDetails?.lighting_designer}
            </h3>
            <h3>Общая сумма: {selectedArchiveEventDetails?.total_sum}</h3>
          </div>
          <div className="right-arc">
            <h2 style={{ marginBottom: "0.5rem" }}>
              <span>Световые приборы на мероприятии:</span>
            </h2>
            <ul>
              {selectedArchiveEventDetails?.equipment.map((eq) => (
                <li key={Math.random()}>{eq}</li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </section>
  );
}
