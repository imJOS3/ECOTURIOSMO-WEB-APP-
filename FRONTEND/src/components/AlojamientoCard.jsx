// src/components/AlojamientoCard.jsx
import { Badge } from "./ui";
import { NatureIcons } from "./icons";

const randomIcon = (id) => NatureIcons[(id || 0) % NatureIcons.length];

const AlojamientoCard = ({ item, onClick }) => (
  <div className="card" onClick={() => onClick(item)}>
    <div className="card-img">
      <div className="card-img-pattern" />
      <span style={{ position: "relative", zIndex: 1 }}>
        {(() => {
          const Icon = randomIcon(item.id);
          return <Icon fontSize="inherit" />;
        })()}
      </span>
      <span className="card-badge">{item.estado || item.estado_publicacion || "activo"}</span>
    </div>
    <div className="card-body">
      <h3 className="card-title">{item.titulo}</h3>
      <p className="card-location">📍 {item.ubicacion}</p>
      <p className="card-desc">{item.descripcion}</p>
      <div className="card-footer">
        <span className="card-price">Ver unidades <span>→</span></span>
        <Badge status={item.estado || item.estado_publicacion} />
      </div>
    </div>
  </div>
);

export default AlojamientoCard;