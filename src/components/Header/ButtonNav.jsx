import "./ButtonNav.css";

export default function ButtonNav({ children, isActive, ...props }) {
  return (
    <button {...props} className={isActive ? "button-active" : "button"}>
      {children}
    </button>
  );
}
