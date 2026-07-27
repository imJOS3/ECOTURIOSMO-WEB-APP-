import { useState } from "react";
import { AmenityIcon } from "../amenityIcons";

const PREVIEW_LIMIT = 10;

export const DetailServices = ({ servicios }) => {
  const [expanded, setExpanded] = useState(false);

  if (!servicios?.length) return null;

  const visible = expanded ? servicios : servicios.slice(0, PREVIEW_LIMIT);
  const hiddenCount = servicios.length - PREVIEW_LIMIT;

  return (
    <div id="sec-servicios" style={{ marginBottom: "2.5rem" }}>
      <h3 className="display" style={{ fontSize: "1.35rem", marginBottom: "1.25rem" }}>
        Lo que este lugar ofrece
      </h3>

      <div className="services-grid">
        {visible.map((servicio) => (
          <div key={servicio.id || servicio.nombre} className="service-item">
            <AmenityIcon icono={servicio.icono} nombre={servicio.nombre} size={24} />
            <span>{servicio.nombre}</span>
          </div>
        ))}
      </div>

      {servicios.length > PREVIEW_LIMIT && (
        <button
          type="button"
          className="btn services-show-all"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Mostrar menos" : `Mostrar los ${servicios.length} servicios`}
          {!expanded && hiddenCount > 0 ? "" : null}
        </button>
      )}
    </div>
  );
};

export default DetailServices;
