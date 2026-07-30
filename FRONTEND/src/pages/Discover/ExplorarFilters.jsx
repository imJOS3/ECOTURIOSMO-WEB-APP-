import { formatCurrency } from "../../utils/media";
import {
  AMBIENTES,
  SORT_OPTIONS,
  countActiveFilters,
} from "../../utils/explorarFilters";

const toggleId = (list, id) => {
  const key = String(id);
  return list.includes(key) ? list.filter((x) => x !== key) : [...list, key];
};

/**
 * Panel de filtros de Explorar.
 */
const ExplorarFilters = ({
  filters,
  onChange,
  onReset,
  departamentos = [],
  categorias = [],
  servicios = [],
  priceBounds,
  moreOpen,
  onToggleMore,
}) => {
  const set = (patch) => onChange({ ...filters, ...patch });
  const activeCount = countActiveFilters(filters);

  const popularServicios = servicios.slice(0, 8);
  const topCategorias = categorias.slice(0, 12);

  return (
    <div className="exp-filters">
      <div className="exp-filters-top">
        <input
          className="form-input exp-search"
          placeholder="Buscar por nombre, lugar o experiencia…"
          value={filters.q}
          onChange={(e) => set({ q: e.target.value })}
          aria-label="Buscar alojamientos"
        />
        <select
          className="form-input exp-sort"
          value={filters.sort}
          onChange={(e) => set({ sort: e.target.value })}
          aria-label="Ordenar"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={`btn btn-sm exp-more-btn ${moreOpen ? "active" : ""}`}
          onClick={onToggleMore}
        >
          Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
        {activeCount > 0 && (
          <button type="button" className="btn btn-sm exp-clear" onClick={onReset}>
            Limpiar
          </button>
        )}
      </div>

      <div className="exp-ambientes" role="group" aria-label="Ideal para">
        {AMBIENTES.map((amb) => (
          <button
            key={amb.id}
            type="button"
            title={amb.hint}
            className={`exp-ambiente ${filters.ambiente === amb.id ? "active" : ""}`}
            onClick={() =>
              set({ ambiente: filters.ambiente === amb.id ? "" : amb.id })
            }
          >
            {amb.label}
          </button>
        ))}
      </div>

      {moreOpen && (
        <div className="exp-panel">
          <div className="exp-panel-grid">
            <div className="form-group">
              <label className="form-label">Departamento / región</label>
              <select
                className="form-input"
                value={filters.departamento}
                onChange={(e) => set({ departamento: e.target.value })}
              >
                <option value="">Toda Colombia</option>
                {departamentos.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Huéspedes (mín.)</label>
              <select
                className="form-input"
                value={filters.huespedes}
                onChange={(e) => set({ huespedes: e.target.value })}
              >
                <option value="">Cualquiera</option>
                {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}+ personas
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Habitaciones (mín.)</label>
              <select
                className="form-input"
                value={filters.habitaciones}
                onChange={(e) => set({ habitaciones: e.target.value })}
              >
                <option value="">Cualquiera</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}+
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de espacio</label>
              <div className="exp-seg">
                {[
                  { id: "todos", label: "Todos" },
                  { id: "privado", label: "Privado" },
                  { id: "compartido", label: "Compartido" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`exp-seg-btn ${filters.privacidad === opt.id ? "active" : ""}`}
                    onClick={() => set({ privacidad: opt.id })}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="exp-price-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">
                Precio mínimo
                {priceBounds && (
                  <span className="form-hint-inline">
                    {" "}
                    (desde ${formatCurrency(priceBounds.min)})
                  </span>
                )}
              </label>
              <input
                className="form-input"
                type="number"
                min={0}
                step={10000}
                placeholder="Ej. 80000"
                value={filters.precioMin}
                onChange={(e) => set({ precioMin: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">
                Precio máximo
                {priceBounds && (
                  <span className="form-hint-inline">
                    {" "}
                    (hasta ${formatCurrency(priceBounds.max)})
                  </span>
                )}
              </label>
              <input
                className="form-input"
                type="number"
                min={0}
                step={10000}
                placeholder="Ej. 350000"
                value={filters.precioMax}
                onChange={(e) => set({ precioMax: e.target.value })}
              />
            </div>
          </div>

          {topCategorias.length > 0 && (
            <div className="exp-block">
              <p className="exp-block-title">Experiencia / tipo</p>
              <div className="chip-grid exp-chips">
                {topCategorias.map((cat) => {
                  const id = String(cat.id);
                  const active = filters.categorias.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`chip-select ${active ? "active" : ""}`}
                      onClick={() => set({ categorias: toggleId(filters.categorias, id) })}
                    >
                      {cat.nombre}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {popularServicios.length > 0 && (
            <div className="exp-block">
              <p className="exp-block-title">Comodidades</p>
              <div className="chip-grid exp-chips">
                {popularServicios.map((srv) => {
                  const id = String(srv.id);
                  const active = filters.servicios.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`chip-select ${active ? "active" : ""}`}
                      onClick={() => set({ servicios: toggleId(filters.servicios, id) })}
                    >
                      {srv.nombre}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExplorarFilters;
