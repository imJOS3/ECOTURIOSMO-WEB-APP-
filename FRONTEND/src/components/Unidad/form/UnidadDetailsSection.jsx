export const UnidadDetailsSection = ({ form, onChange }) => (
  <section style={{ marginBottom: "2rem" }}>
    <h3 className="display" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Capacidad y precio</h3>
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Capacidad (personas)</label>
        <input
          className="form-input"
          type="number"
          min={1}
          value={form.capacidad}
          onChange={(event) => onChange("capacidad", event.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Precio por noche</label>
        <input
          className="form-input"
          type="number"
          min={0}
          step="1000"
          placeholder="150000"
          value={form.precio_noche}
          onChange={(event) => onChange("precio_noche", event.target.value)}
        />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Cupos disponibles</label>
        <input
          className="form-input"
          type="number"
          min={1}
          placeholder="Igual a la capacidad si se deja vacío"
          value={form.cupos_disponibles}
          onChange={(event) => onChange("cupos_disponibles", event.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">¿Compartido?</label>
        <select
          className="form-input form-select"
          value={String(form.es_compartido)}
          onChange={(event) => onChange("es_compartido", event.target.value === "true")}
        >
          <option value="false">No — privado</option>
          <option value="true">Sí — compartido</option>
        </select>
      </div>
    </div>
  </section>
);

export default UnidadDetailsSection;