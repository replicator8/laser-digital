import "./Equipment.css";
import { useState, useEffect, useCallback } from "react";
import InfoSection from "./InfoSection";

export default function Equipment() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const response = await fetch("http://localhost:8002/store");
    const categories = await response.json();
    setCategories(categories.categories);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories]);

  const groupCategories = (array, size) => {
    const groups = [];
    for (let i = 0; i < array.length; i += size) {
      groups.push(array.slice(i, i + size));
    }
    return groups;
  };

  return (
    <>
      <section className="info">
        <InfoSection/>
      </section>

      {loading && <p style={{textAlign: 'center'}}>Loading...</p>}
      {!loading && categories.length === 0 && <p style={{textAlign: 'center'}}>No categories found...</p>}
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
                  <a onClick={console.log("Open new tab...")} className="equipment-title">
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
  );
}
