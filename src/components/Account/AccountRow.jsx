export default function AccountRow({children, body}) {
  return (
    <div className="ac-row">
      <h1 className="yellow">{children}:</h1>
      <h1>{body}</h1>
    </div>
  );
}
