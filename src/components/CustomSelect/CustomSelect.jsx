import { useState, useRef, useEffect } from "react";
import "./CustomSelect.css";

export default function CustomSelect({
  label,
  options,
  selectedItems,
  onAdd,
  onRemove,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleSelect = () => setIsOpen((prev) => !prev);

  const handleAdd = (equipment) => {
    onAdd(equipment);
  };

  const handleRemove = (title) => {
    onRemove(title);
  };

  return (
    <div className="custom-select-container" ref={selectRef}>
      <label>{label}</label>
      <div className="control custom-select" onClick={toggleSelect}>
        {"Выберите прибор"}
      </div>

      {isOpen && (
        <div className="options-list">
          {options.map((option) => (
            <div key={option.title} className="option-item">
              <p>{option.title}</p>
              <div className="controls">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(option.title);
                  }}
                >
                  -
                </button>
                <p>{selectedItems[option.title]?.count || 0}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd(option);
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
