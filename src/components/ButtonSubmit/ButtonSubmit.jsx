import "./ButtonSubmit.css";

export default function Button({ children, ...props }) {
  return (
    <button {...props} className="btn-submit">
      {children}
    </button>
  );
}
