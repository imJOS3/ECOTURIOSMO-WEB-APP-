import { useEffect } from "react";
import { useServiciosStore } from "../../stores/useServiciosStore";
import { AmenityIcon } from "./amenityIcons";

const ServicePicker = ({
  value = [],
  onChange,
  label = "Servicios",
  hint = "Selecciona lo que ofrece el alojamiento",
  disabled = false,
}) => {
  const items = useServiciosStore((state) => state.items);
  const loading = useServiciosStore((state) => state.loading);
  const error = useServiciosStore((state) => state.error);
  const fetchServicios = useServiciosStore((state) => state.fetchServicios);

  useEffect(() => {
    fetchServicios().catch(() => {});
  }, [fetchServicios]);

  const toggle = (id) => {
    if (disabled) return;
    const next = value.includes(id)
      ? value.filter((servicioId) => servicioId !== id)
      : [...value, id];
    onChange?.(next);
  };

  return (
    <div className="form-group">
      <div className="form-label-row">
        <label className="form-label">{label}</label>
        <span className="form-hint">{hint}</span>
      </div>

      {loading ? (
        <div className="picker-skeleton">Cargando servicios...</div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : items.length === 0 ? (
        <div className="picker-empty">No hay servicios en el catálogo.</div>
      ) : (
        <div className="chip-grid">
          {items.map((servicio) => {
            const active = value.includes(servicio.id);
            return (
              <button
                key={servicio.id}
                type="button"
                className={`chip-select ${active ? "active" : ""}`}
                onClick={() => toggle(servicio.id)}
                disabled={disabled}
              >
                <AmenityIcon icono={servicio.icono} nombre={servicio.nombre} size={16} />
                <span>{servicio.nombre}</span>
                {active && <span className="chip-dot">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServicePicker;
