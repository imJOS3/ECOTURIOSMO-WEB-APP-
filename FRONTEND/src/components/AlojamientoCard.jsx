// src/components/AlojamientoCard.jsx
import { Badge } from "./ui";
import NatureIcons from "./icons.constants";
import { formatCurrency, getEntityCategories, getPrimaryImage } from "../utils/media";

const randomIcon = (id) => NatureIcons[(id || 0) % NatureIcons.length];

const AlojamientoCard = ({ item, onClick }) => (
  <div className="card" onClick={() => onClick(item)}>
    <div className="card-img" style={{ backgroundImage: getPrimaryImage(item) ? `url(${getPrimaryImage(item)})` : undefined }}>
      <div className="card-img-pattern" />
      {!getPrimaryImage(item) && (
        <span style={{ position: "relative", zIndex: 1 }}>
          {(() => {
            const Icon = randomIcon(item.id);
            return <Icon fontSize="inherit" />;
          })()}
        </span>
      )}
      <div className="card-top-row">
        <span className="card-badge">{item.estado || item.estado_publicacion || "activo"}</span>
        {getEntityCategories(item).length > 0 && (
          <span className="card-image-count">{getEntityCategories(item).length} categorías</span>
        )}
      </div>
    </div>
    <div className="card-body">
      <h3 className="card-title">{item.titulo}</h3>
      <p className="card-location">📍 {item.ubicacion}</p>
      <p className="card-desc">{item.descripcion}</p>
      <div className="tag-row">
        {getEntityCategories(item).slice(0, 3).map((categoria) => (
          <span key={categoria.id || categoria.nombre} className="tag-pill">{categoria.nombre}</span>
        ))}
      </div>
      <div className="card-footer">
        <span className="card-price">Desde <span>${formatCurrency(item.precio_desde || item.precio_noche || 0)}</span></span>
        <Badge status={item.estado || item.estado_publicacion} />
      </div>
    </div>
  </div>
);

export default AlojamientoCard;