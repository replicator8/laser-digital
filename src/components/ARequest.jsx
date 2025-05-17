export default function ARequest({ event }) {
  return (
    <div className="arequest-item">
      <p>{event.title}</p>
      <p>{event.date}</p>
      {event.status === "active" && (
        <div className="active-block-progress">
          <img src="src/photo/active.svg" alt="active" className="logo-active"/>
          <p>В работе</p>
        </div>
      )}
      {event.status === "archive" && (
        <div className="archive-block-progress">
          <img src="src/photo/archive.svg" alt="archive" className="logo-archive"/>
          <p>Завершено</p>
        </div>
      )}
    </div>
  );
}
