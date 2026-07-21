// src/components/alojamientos/form/AlojamientoLocationSection.jsx
import { MapIcon } from "../../common/icons/icons";

export const AlojamientoLocationSection = ({ form, onChange }) => (
  <section style={{ marginBottom: "2rem" }}>
    <h3 className="display" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <MapIcon fontSize="small" /> Ubicación en el mapa (opcional)
      </span>
    </h3>
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Latitud</label>
        <input
          className="form-input"
          type="number"
          step="any"
          placeholder="4.711"
          value={form.latitud}
          onChange={(event) => onChange("latitud", event.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Longitud</label>
        <input
          className="form-input"
          type="number"
          step="any"
          placeholder="-74.072"
          value={form.longitud}
          onChange={(event) => onChange("longitud", event.target.value)}
        />
      </div>
    </div>
  </section>
);

export default AlojamientoLocationSection;