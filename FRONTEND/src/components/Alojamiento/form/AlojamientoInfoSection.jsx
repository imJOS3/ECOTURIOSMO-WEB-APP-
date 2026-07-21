// src/components/alojamientos/form/AlojamientoInfoSection.jsx
//
// Componente puramente presentacional: solo pinta los campos y avisa
// cambios via onChange(field, value). No conoce stores ni validación.
export const AlojamientoInfoSection = ({ form, onChange }) => (
  <section style={{ marginBottom: "2rem" }}>
    <h3 className="display" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Información general</h3>
    <div className="form-grid">
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
        <label className="form-label">Ubicación *</label>
        <input
          className="form-input"
          placeholder="Ej: Sierra Nevada, Colombia"
          value={form.ubicacion}
          onChange={(event) => onChange("ubicacion", event.target.value)}
        />
      </div>
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
  </section>
);

export default AlojamientoInfoSection;