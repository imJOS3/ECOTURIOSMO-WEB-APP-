import { DESCRIPTION_LIMIT } from "./constants";

export const DetailDescription = ({ descripcion, expanded, onToggle }) => {
  const isLong = (descripcion || "").length > DESCRIPTION_LIMIT;
  const shown =
    expanded || !isLong
      ? descripcion
      : `${descripcion.slice(0, DESCRIPTION_LIMIT).trim()}…`;

  return (
    <>
      <p
        style={{
          lineHeight: "1.8",
          margin: "0 0 0.5rem",
          fontSize: "0.98rem",
          whiteSpace: "pre-line",
        }}
      >
        {shown}
      </p>
      {isLong && (
        <button className="description-toggle-btn" onClick={onToggle}>
          {expanded ? "Mostrar menos" : "Mostrar más"}
        </button>
      )}
      <div style={{ marginBottom: "2rem" }} />
    </>
  );
};

export default DetailDescription;
