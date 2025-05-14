import "./Equipment.css";
import { useState, useEffect, useCallback } from "react";
import InfoSection from "./InfoSection";
import axios from "axios";
import Modal from "../Modal/Modal";
import CategoryInfo from "./CategoryInfo";

export default function Equipment() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [isEquipments, setIsEquipments] = useState(false);
  const [modal, setModal] = useState(false);
  const [pribor, setPribor] = useState(null);
  const [currentEquipment, setCurrentEquipment] = useState(null);
  const [currentCategorySlug, setCurrentCategorySlug] = useState(null);

  const getCategories = useCallback(async () => {
    setLoading(true);
    axios
      .get("http://localhost:8002/store", {
        withCredentials: true,
      })
      .then((response) => {
        const categories = response.data;
        setCategories(categories.categories);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error fetching categories:",
          error.response?.data || error.message
        );
      });
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const groupCategories = (array, size) => {
    const groups = [];
    for (let i = 0; i < array.length; i += size) {
      groups.push(array.slice(i, i + size));
    }
    return groups;
  };

  function handleCategoryClick(id) {
    setCurrentCategorySlug(id);
    axios
      .get(`http://localhost:8002/store/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        const equipments = response.data;
        setEquipments(equipments.equipments);
        setCurrentEquipment(equipments);
        setIsEquipments(true);
      });
  }

  function handleOpenModal(eqId) {
    axios
      .get(`http://localhost:8002/store/${currentCategorySlug}/${eqId}`, {
        withCredentials: true,
      })
      .then((response) => {
        const pribore = response.data;
        setPribor(pribore);
        console.log(pribore);
        setModal(true);
      });
  }

  return (
    <>
      {!isEquipments && (
        <>
          <section className="info">
            <InfoSection />
          </section>

          {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
          {!loading && categories.length === 0 && (
            <p style={{ textAlign: "center" }}>No categories found...</p>
          )}
          {!loading && categories.length > 0 && (
            <div className="equipments">
              {groupCategories(categories, 3).map((row, rowIndex) => (
                <div key={rowIndex} className="equipmens-row">
                  {row.map((category) => (
                    <div
                      key={category.category_slug}
                      className="equipment-block"
                      id={category.category_slug}
                    >
                      <img
                        className="equipment-img"
                        src={category.photo_url}
                        alt="Photo here"
                      />
                      <a
                        onClick={() =>
                          handleCategoryClick(category.category_slug)
                        }
                        className="equipment-title"
                      >
                        {category.title}
                      </a>
                      <p className="equipment-hint">{category.hint}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEquipments && (
        <>
          <section className="info">
            <CategoryInfo
              title={currentEquipment?.title}
              description={currentEquipment?.description}
            />
          </section>

          {equipments.length > 0 && (
            <div className="equipments">
              {groupCategories(equipments, 3).map((row, rowIndex) => (
                <div key={rowIndex} className="equipmens-row">
                  {row.map((equipment) => (
                    <div
                      key={equipment.equipment_slug}
                      className="equipment-block"
                      id={equipment.equipment_slug}
                    >
                      <img
                        className="equipment-img"
                        src={equipment.photo_url}
                        alt="Photo here"
                      />
                      <a
                        onClick={() =>
                          handleOpenModal(equipment.equipment_slug)
                        }
                        className="equipment-title"
                        style={{ paddingBottom: "1rem" }}
                      >
                        {equipment.title}
                      </a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <Modal open={modal}>
        <div className="modal-h">
          <h3 className="cr-title">{pribor?.title}</h3>
          <button className="m-close-btn" onClick={() => setModal(false)}>
            <img
              src="src/photo/close.svg"
              alt="close"
              className="m-close-photo"
            />
          </button>
        </div>

        <div className="pribor-row">
          {pribor?.photo_url && (
            <img
              src={pribor.photo_url.trim()}
              alt={pribor.title}
              className="modal-photo"
            />
          )}

          <div className="modal-specs">
            {Object.entries(pribor?.characteristics || {}).map(
              ([key, value]) => (
                <div key={key} className="spec-row">
                  <span className="spec-name">{key}:</span>

                  <span className="spec-value">{value}</span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="modal-description">
          <h4>Описание</h4>
          <p>{pribor?.description}</p>
        </div>
      </Modal>
    </>
  );
}
