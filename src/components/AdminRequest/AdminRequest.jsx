import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import ARequest from "../ARequest";
import "./AdminRequest.css";
import Modal from "../Modal/Modal";
import ButtonSubmit from "../ButtonSubmit/ButtonSubmit";
import Popup from "../Popup/Popup";
import CustomSelect from "../CustomSelect/CustomSelect";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function AdminRequest() {
  const [showPopup, setShowPopup] = useState(false);
  const [allRequests, setAllRequests] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [selectedActiveEventDetails, setSelectedActiveEventDetails] =
    useState(null);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState({});
  const [manager_name, setManager_name] = useState("");
  const [manager_phone_number, setManager_phone_number] = useState("");
  const [sum, setSum] = useState(0);
  const [discount, setDiscount] = useState(0);

  const { lastMessage, sendMessage, readyState } = useWebSocket(`ws://localhost:8002/ws/event`, {
    shouldReconnect: (closeEvent) => {
      console.log("WebSocket closed:", closeEvent);
      return true;
    },
    reconnectInterval: 3000,
    onOpen: () => console.log("WebSocket connected"),
    onClose: () => console.log("WebSocket disconnected"),
    onError: (error) => console.error("WebSocket error:", error),
    options: { withCredentials: true },
  });

  useEffect(() => {
    return () => {
      setAllRequests([]);
      setSelectedActiveEventDetails(null);
      setCurrentEventId(null);
      setSelectedEquipments({});
      setEquipments([]);
      setManager_name("");
      setManager_phone_number("");
      setSum(0);
      setDiscount(0);
    };
  }, []);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const newEvent = JSON.parse(lastMessage.data);

        setAllRequests((prevRequests) => {
          const exists = prevRequests.some(
            (req) => req.event_id === newEvent.event_id
          );
          if (!exists) {
            return [newEvent, ...prevRequests];
          }
          return prevRequests;
        });
        console.log(newEvent);
      } catch (error) {
        console.error("Ошибка парсинга сообщения:", error);
      }
    }
  }, [lastMessage]);

  const getAllRequests = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8002/events/all", {
        withCredentials: true,
      });
      setAllRequests(response.data.events);
    } catch (error) {
      console.error(
        "Error fetching all requests:",
        error.response?.data || error.message
      );
    }
  }, []);

  useEffect(() => {
    getAllRequests();
  }, [getAllRequests]);

  const handleRequestClick = useCallback(async (eventId, status) => {
    if (status === "ACTIVE") {
      try {
        const response = await axios.get(
          `http://localhost:8002/events/admin/active/${eventId}`,
          {
            withCredentials: true,
          }
        );
        setSelectedActiveEventDetails(response.data);
        setCurrentEventId(eventId);
        console.log(response.data);
        await getEquipments();
        setModalActive(true);
      } catch (error) {
        console.error("Ошибка получения деталей заявки:", error);
      }
    } else if (status === "ARCHIVE") {
      console.log("ARCHIVE");
    }
  }, []);

  const getEquipments = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8002/store/events/equipments-by-category",
        {
          withCredentials: true,
        }
      );
      setEquipments(response.data.equipments);
    } catch (error) {
      console.error("Ошибка получения всех приборов:", error);
    }
  }, []);

  const handleAddEquipment = (equipment) => {
    setSelectedEquipments((prev) => {
      const updated = { ...prev };
      if (!updated[equipment.title]) {
        updated[equipment.title] = { ...equipment, count: 1 };
      } else {
        updated[equipment.title].count += 1;
      }
      return updated;
    });
  };

  const handleRemoveEquipment = (title) => {
    setSelectedEquipments((prev) => {
      const updated = { ...prev };
      if (updated[title]?.count > 0) {
        updated[title].count -= 1;
        if (updated[title].count === 0) {
          delete updated[title];
        }
      }
      return updated;
    });
  };

  function handleCloseModal() {
    setModalActive(false);
    setSelectedEquipments({});
  }

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  function sendClient(e) {
    e.preventDefault();
    console.log(selectedEquipments);

    const currentEq = Object.values(selectedEquipments).map((item) => ({
      title: item.title,
      quantity: item.count,
    }));

    axios
      .post(
        `http://localhost:8002/events/admin/confirm_event/${currentEventId}`,
        {
          event_id: currentEventId,
          discount: parseInt(discount, 10),
          manager_username: manager_name,
          manager_phone_number: manager_phone_number,
          equipments: currentEq,
        },
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        console.log(response);
      });

    handleCloseModal();
    handleShowPopup();
  }

  return (
    <section className="admin-list">
      {allRequests.map((event) => (
        <div
          key={event.event_id}
          onClick={() => handleRequestClick(event.event_id, event.status)}
          style={{ cursor: "pointer" }}
          className="arequest-admin"
        >
          <ARequest event={event} />
        </div>
      ))}

      <Modal open={modalActive} isAdmin={true}>
        <div className="modal-h">
          <h3 className="cr-title">{selectedActiveEventDetails?.title}</h3>
          <button className="m-close-btn" onClick={() => handleCloseModal()}>
            <img
              src="src/photo/close.svg"
              alt="close"
              className="m-close-photo"
            />
          </button>
        </div>

        <div className="adm-forms" onSubmit={sendClient}>
          <form className="create-event-form">
            <div className="adm-r-dates">
              <div className="adm-r-dtStart">
                <label htmlFor="dtStart" className="adm-lb-dt">
                  Дата начала
                </label>
                <input
                  type="datetime-local"
                  id="dtStart"
                  className="control adm-date"
                  value={selectedActiveEventDetails?.event_date ?? ""}
                  disabled={true}
                />
              </div>
              <div className="adm-r-dtEnd">
                <label htmlFor="dtEnd" className="adm-lb-dt">
                  Дата окончания
                </label>
                <input
                  type="datetime-local"
                  id="dtEnd"
                  className="control adm-date"
                  value={selectedActiveEventDetails?.event_end_date ?? ""}
                  disabled={true}
                />
              </div>
            </div>

            <label htmlFor="type">Тип мероприятия</label>
            <select
              name=""
              id="type"
              className="control adm-input"
              value={selectedActiveEventDetails?.type ?? ""}
              disabled={true}
            >
              <option value="Концерт">Концерт</option>
              <option value="Свадьба">Свадьба</option>
              <option value="Корпоратив">Корпоратив</option>
              <option value="День рождения">День рождения</option>
            </select>
            <label htmlFor="name">Наименование мероприятия</label>
            <input
              type="text"
              id="name"
              className="control adm-input"
              value={selectedActiveEventDetails?.title ?? ""}
              disabled={true}
            />
            <label htmlFor="file">План помещения</label>
            <input
              type="file"
              id="file"
              className="control adm-input"
              disabled={true}
            />
            <label htmlFor="address">Адрес проведения мероприятия</label>
            <input
              type="text"
              id="address"
              className="control adm-input"
              value={selectedActiveEventDetails?.address ?? ""}
              disabled={true}
            />

            <div className="adm-mini">
              <div className="adm-inputs-mini">
                <label htmlFor="payment">Вариант оплаты</label>
                <select
                  name=""
                  id="payment"
                  className="control"
                  value={selectedActiveEventDetails?.payment_method ?? "ИП"}
                  disabled={true}
                >
                  <option value="ИП">ИП</option>
                  <option value="ООО">ООО</option>
                  <option value="Физ. лицо">Физ. лицо</option>
                </select>
              </div>
              <div className="adm-inputs-mini">
                <label htmlFor="square">Площадь, м^2</label>
                <input
                  type="number"
                  id="square"
                  className="control"
                  value={selectedActiveEventDetails?.site_area ?? 1}
                  disabled={true}
                />
              </div>
            </div>

            <div className="adm-mini">
              <div className="adm-inputs-mini">
                <label htmlFor="height">высота потолка, м</label>
                <input
                  type="number"
                  id="height"
                  className="control"
                  value={selectedActiveEventDetails?.ceiling_height ?? 1}
                  disabled={true}
                />
              </div>
              <div className="adm-inputs-mini">
                <label htmlFor="isRecord">телесъемка</label>
                <select
                  name=""
                  id="isRecord"
                  className="control"
                  value={selectedActiveEventDetails?.has_tv ?? "Нет"}
                  disabled={true}
                >
                  <option value={false}>Нет</option>
                  <option value={true}>Да</option>
                </select>
              </div>
            </div>

            <div className="adm-mini">
              <div className="adm-inputs-mini">
                <label htmlFor="minTime">мин. время для монтажа, ч</label>
                <input
                  type="number"
                  id="minTime"
                  className="control"
                  value={selectedActiveEventDetails?.min_install_time ?? 1}
                  disabled={true}
                />
              </div>
              <div className="adm-inputs-mini">
                <label htmlFor="power">доступная мощность, кВТ</label>
                <input
                  type="number"
                  id="power"
                  className="control"
                  value={selectedActiveEventDetails?.total_power ?? 10}
                  disabled={true}
                />
              </div>
            </div>

            <div className="adm-mini">
              <div className="adm-inputs-mini">
                <label htmlFor="isDownTime" className="adm-big-lb">
                  простой
                </label>
                <select
                  name=""
                  id="isDownTime"
                  className="control"
                  value={selectedActiveEventDetails?.has_downtime || "Нет"}
                  disabled={true}
                >
                  <option value={false}>Нет</option>
                  <option value={true}>Да</option>
                </select>
              </div>
              <div className="adm-inputs-mini">
                <label htmlFor="comment">Комментарий</label>
                <textarea
                  type="text"
                  id="comment"
                  className="control"
                  value={selectedActiveEventDetails?.comment ?? ""}
                  disabled={true}
                />
              </div>
            </div>
            <p className="eq-ar" style={{ marginBottom: "0.5rem" }}>
              <span>Приборы:</span>
            </p>
            <ul className="adm-eq-list">
              {selectedActiveEventDetails?.equipments.length === 0 &&
                Object.keys(selectedEquipments).length === 0 && (
                  <p>Пока пусто :)</p>
                )}
              {selectedActiveEventDetails?.equipments.length === 0 && (
                <ul>
                  {Object.values(selectedEquipments)
                    .filter((eq) => eq.count > 0)
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((eq) => (
                      <li key={eq.title}>
                        <strong>
                          {eq.count} X {eq.title.toUpperCase()}
                        </strong>
                      </li>
                    ))}
                </ul>
              )}
              {selectedActiveEventDetails?.equipments.map((eq) => (
                <li key={Math.random()}>{eq}</li>
              ))}
            </ul>
          </form>

          <form className="adjust-equipment">
            <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
              НАСТРОЙКА <span>ОБОРУДОВАНИЯ</span>
            </h3>

            {equipments.map((category) => (
              <div key={category.category_title} className="equipment-category">
                <CustomSelect
                  label={category.category_title}
                  options={category.equipments_catalog}
                  selectedItems={selectedEquipments}
                  onAdd={handleAddEquipment}
                  onRemove={handleRemoveEquipment}
                />
              </div>
            ))}

            <div className="adm-mini">
              <div className="adm-inputs-mini">
                <label htmlFor="manager" className="adm-label-set">
                  <span>имя менеджера</span>
                </label>
                <input
                  type="text"
                  id="manager"
                  className="control"
                  value={manager_name}
                  onChange={(e) => setManager_name(e.target.value)}
                />
              </div>

              <div className="adm-inputs-mini">
                <label htmlFor="tel" className="adm-label-set">
                  <span>Номер телефона</span>
                </label>
                <input
                  type="tel"
                  id="tel"
                  className="control"
                  value={manager_phone_number}
                  onChange={(e) => setManager_phone_number(e.target.value)}
                />
              </div>
            </div>

            <div className="adm-mini">
              <div className="adm-inputs-mini">
                <label htmlFor="sum" className="adm-label-set">
                  <span>итоговая смета</span>
                </label>
                <input
                  type="number"
                  id="sum"
                  className="control"
                  value={sum}
                  onChange={(e) => setSum(e.target.value)}
                  min={0}
                />
              </div>

              <div className="adm-inputs-mini">
                <label htmlFor="discount" className="adm-label-set">
                  <span>скидка, %</span>
                </label>
                <input
                  type="number"
                  id="discount"
                  className="control"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  min={0}
                  max={100}
                />
              </div>
            </div>
            <ButtonSubmit>
              Отправить заказчику и сформировать смету
            </ButtonSubmit>
          </form>
        </div>
      </Modal>

      <Popup
        message="Заявка успешно отправлена покупателю!"
        isVisible={showPopup}
        onClose={handleClosePopup}
      />
    </section>
  );
}
