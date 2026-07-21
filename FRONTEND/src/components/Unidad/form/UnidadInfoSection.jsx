export const UnidadInfoSection = ({ form, onChange }) => (
  <section style={{ marginBottom: "2rem" }}>
    <h3 className="display" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Información general</h3>
    <div className="form-grid">
      <div className="form-group">
        <label className="form-label">Nombre</label>
        <input
          className="form-input"
          placeholder="Ej: Cabaña Principal"
          value={form.nombre}
          onChange={(event) => onChange("nombre", event.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Tipo</label>
        <select
          className="form-input form-select"
          value={form.tipo}
          onChange={(event) => onChange("tipo", event.target.value)}
        >
          <option value="habitacion">Habitación</option>
          <option value="cabaña">Cabaña</option>
          <option value="glamping">Glamping</option>
          <option value="apartamento">Apartamento</option>
          <option value="otro">Otro</option>
        </select>
      </div>
    </div>

    <div className="form-group">
      <label className="form-label">Descripción</label>
      <textarea
        className="form-input"
        rows={4}
        placeholder="Describe la unidad: comodidades, vista, distribución..."
        value={form.descripcion}
        onChange={(event) => onChange("descripcion", event.target.value)}
        style={{ resize: "vertical" }}
      />
    </div>
  </section>
);

export default UnidadInfoSection;