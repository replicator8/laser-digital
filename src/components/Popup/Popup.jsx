import "./Popup.css";

export default function Popup({ message, isVisible, onClose }) {
  if (!isVisible) return null;

  const handleAnimationEnd = () => {
    onClose();
  };

  return (
    <div className="popup" onAnimationEnd={handleAnimationEnd}>
      {message}
    </div>
  );
}
