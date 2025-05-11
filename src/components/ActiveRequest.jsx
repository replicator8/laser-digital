export default function ActiveRequest({ activeEvent }) {
  return (
    <div>
      <p>{activeEvent.title}</p>
      <p>{activeEvent.date}</p>
      <p>смета: {activeEvent.estimate} руб.</p>
    </div>
  );
}
