export default function CategoryInfo({ title, description }) {
  return (
    <>
      <h3>
        <span>{title}</span>
      </h3>
      <br />
      <p>{description}</p>
    </>
  );
}
