import { Badge } from "./ui";
import { formatCurrency, getEntityCategories, getPrimaryImage } from "../utils/media";

const UnidadCard = ({ unidad, onClick, selected = false, actions = null }) => {
  const image = getPrimaryImage(unidad);
  const categories = getEntityCategories(unidad);

  return (
    <div
      className={`unidad-card ${selected ? "selected" : ""}`}
      onClick={() => onClick?.(unidad)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="unidad-card-media" style={{ backgroundImage: image ? `url(${image})` : undefined }}>
        {!image && <span className="unidad-card-fallback">{unidad.nombre?.[0] || "U"}</span>}
        <Badge status={unidad.estado || unidad.estado_publicacion} />
      </div>
      <div className="unidad-card-body">
        <div>
          <h4>{unidad.nombre}</h4>
          <p>{unidad.tipo} · Cap. {unidad.capacidad}{unidad.es_compartido ? " · compartido" : ""}</p>
        </div>
        {categories.length > 0 && (
          <div className="tag-row">
            {categories.slice(0, 3).map((categoria) => (
              <span key={categoria.id || categoria.nombre} className="tag-pill">{categoria.nombre}</span>
            ))}
          </div>
        )}
        <div className="unidad-card-footer">
          <strong>${formatCurrency(unidad.precio_noche || 0)}</strong>
          <span>por noche</span>
        </div>
        {actions && <div className="unidad-card-actions">{actions}</div>}
      </div>
    </div>
  );
};

export default UnidadCard;
