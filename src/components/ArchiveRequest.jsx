export default function ArchiveRequest({ archiveEvent }) {
  return (
    <div>
      <p>{archiveEvent.title}</p>
      <p>{archiveEvent.date}</p>
      <p>{archiveEvent.equipment_count} приборов</p>
      <p>смета: {archiveEvent.estimate} руб.</p>
    </div>
  );
}
