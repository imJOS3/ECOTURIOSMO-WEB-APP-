import { useEffect } from "react";
import { useCategoriasStore } from "../../stores/useCategoriasStore";
import { AmenityIcon } from "./amenityIcons";

const CategoryPicker = ({
  tipo,
  value = [],
  onChange,
  label = "Categorías",
  hint = "Selecciona una o varias categorías",
  disabled = false,
}) => {
  const bucket = useCategoriasStore((state) => state.porTipo[tipo] || { items: [], loading: false, error: null });
  const fetchCategorias = useCategoriasStore((state) => state.fetchCategorias);

  useEffect(() => {
    fetchCategorias(tipo).catch(() => {});
  }, [fetchCategorias, tipo]);

  const toggle = (id) => {
    if (disabled) return;
    const next = value.includes(id)
      ? value.filter((categoriaId) => categoriaId !== id)
      : [...value, id];
    onChange?.(next);
  };

  return (
    <div className="form-group">
      <div className="form-label-row">
        <label className="form-label">{label}</label>
        <span className="form-hint">{hint}</span>
      </div>

      {bucket.loading ? (
        <div className="picker-skeleton">Cargando categorías...</div>
      ) : bucket.error ? (
        <div className="alert alert-error">{bucket.error}</div>
      ) : bucket.items.length === 0 ? (
        <div className="picker-empty">No hay categorías para este tipo.</div>
      ) : (
        <div className="chip-grid">
          {bucket.items.map((categoria) => {
            const active = value.includes(categoria.id);
            return (
              <button
                key={categoria.id}
                type="button"
                className={`chip-select ${active ? "active" : ""}`}
                onClick={() => toggle(categoria.id)}
                disabled={disabled}
              >
                <AmenityIcon icono={categoria.icono} nombre={categoria.nombre} size={16} />
                <span>{categoria.nombre}</span>
                {active && <span className="chip-dot">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryPicker;
