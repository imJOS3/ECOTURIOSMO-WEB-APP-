export const AlojamientoInfoSection = ({ form, onChange }) => (
  <section style={{ marginBottom: "2rem" }}>
    <h3 className="display" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Información general</h3>
    <div className="form-group">
      <label className="form-label">Título *</label>
      <input
        className="form-input"
        placeholder="Ej: Cabaña Bosque Nublado"
        value={form.titulo}
        onChange={(event) => onChange("titulo", event.target.value)}
      />
    </div>

    <div className="form-group">
      <label className="form-label">Descripción * (mín. 10 caracteres)</label>
      <textarea
        className="form-input"
        rows={6}
        placeholder="Cuéntale a los huéspedes qué hace especial a tu alojamiento: el entorno, la experiencia, cómo llegar..."
        value={form.descripcion}
        onChange={(event) => onChange("descripcion", event.target.value)}
        style={{ resize: "vertical" }}
      />
    </div>

    <h3 className="display" style={{ fontSize: "1.1rem", margin: "1.5rem 0 1rem" }}>Capacidad y precio</h3>
    <div className="form-grid">
      <div className="form-group">
        <label className="form-label">Precio por noche (COP) *</label>
        <input
          className="form-input"
          type="number"
          min="1"
          step="1000"
          placeholder="Ej: 120000"
          value={form.precio_noche}
          onChange={(event) => onChange("precio_noche", event.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Capacidad (huéspedes) *</label>
        <input
          className="form-input"
          type="number"
          min="1"
          placeholder="Ej: 4"
          value={form.capacidad}
          onChange={(event) => onChange("capacidad", event.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Habitaciones</label>
        <input
          className="form-input"
          type="number"
          min="0"
          value={form.habitaciones}
          onChange={(event) => onChange("habitaciones", event.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Camas</label>
        <input
          className="form-input"
          type="number"
          min="0"
          value={form.camas}
          onChange={(event) => onChange("camas", event.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Baños</label>
        <input
          className="form-input"
          type="number"
          min="0"
          value={form.banos}
          onChange={(event) => onChange("banos", event.target.value)}
        />
      </div>
      <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: "1.5rem" }}>
        <input
          id="es_compartido"
          type="checkbox"
          checked={Boolean(form.es_compartido)}
          onChange={(event) => onChange("es_compartido", event.target.checked)}
        />
        <label htmlFor="es_compartido" className="form-label" style={{ margin: 0 }}>
          Espacio compartido (varios huéspedes pueden reservar a la vez)
        </label>
      </div>
    </div>
  </section>
);

export default AlojamientoInfoSection;
