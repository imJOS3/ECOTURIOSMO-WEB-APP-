// src/components/AlojamientoForm.jsx
import { useState } from "react";
import { apiFetch } from "../utils/api";
import { CloseIcon, RefreshIcon, CalendarIcon } from "./icons";

export const AlojamientoForm = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({ titulo: "", descripcion: "", ubicacion: "", latitud: "", longitud: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.titulo.trim()) { setError("El título es obligatorio"); return; }
    if (form.descripcion.trim().length < 10) { setError("La descripción debe tener al menos 10 caracteres"); return; }
    if (!form.ubicacion.trim()) { setError("La ubicación es obligatoria"); return; }
    setLoading(true); setError("");
    try {
      await apiFetch("/alojamientos", {
        method: "POST",
        body: JSON.stringify({
          titulo: form.titulo.trim(),
          descripcion: form.descripcion.trim(),
          ubicacion: form.ubicacion.trim(),
          latitud: form.latitud ? parseFloat(form.latitud) : null,
          longitud: form.longitud ? parseFloat(form.longitud) : null,
        }),
      });
      onCreated();
    } catch (e) { setError(e.message); setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title display">Nuevo alojamiento</h2>
          <button className="modal-close" onClick={onClose}><CloseIcon fontSize="inherit" /></button>
        </div>
        <div className="alert alert-amber">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><CalendarIcon fontSize="small" /> El alojamiento quedará en revisión hasta que un admin lo apruebe. El precio se configura en cada unidad.</span>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">Título *</label>
          <input className="form-input" placeholder="Ej: Cabaña Bosque Nublado" value={form.titulo} onChange={set("titulo")} />
        </div>
        <div className="form-group">
          <label className="form-label">Descripción * (mín. 10 caracteres)</label>
          <textarea className="form-input" rows={3} placeholder="Describe el alojamiento..." value={form.descripcion} onChange={set("descripcion")} style={{ resize: "vertical" }} />
        </div>
        <div className="form-group">
          <label className="form-label">Ubicación *</label>
          <input className="form-input" placeholder="Ej: Sierra Nevada, Colombia" value={form.ubicacion} onChange={set("ubicacion")} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Latitud (opcional)</label>
            <input className="form-input" type="number" step="any" placeholder="4.711" value={form.latitud} onChange={set("latitud")} />
          </div>
          <div className="form-group">
            <label className="form-label">Longitud (opcional)</label>
            <input className="form-input" type="number" step="any" placeholder="-74.072" value={form.longitud} onChange={set("longitud")} />
          </div>
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><RefreshIcon fontSize="small" /> Después de aprobación, podrás agregar unidades con su precio por noche.</span>
        </p>
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={submit} disabled={loading}>
          {loading ? "Guardando..." : "Crear alojamiento"}
        </button>
      </div>
    </div>
  );
};

// ─── UnidadForm ────────────────────────────────────────────────────────────────
export const UnidadForm = ({ alojamientoId, onClose, onCreated }) => {
  const [form, setForm] = useState({ nombre: "", tipo: "habitacion", descripcion: "", capacidad: 1, es_compartido: false, precio_noche: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.nombre || !form.precio_noche) { setError("Nombre y precio son obligatorios"); return; }
    setLoading(true); setError("");
    try {
      await apiFetch("/unidades", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          id_alojamiento: alojamientoId,
          capacidad: parseInt(form.capacidad) || 1,
          precio_noche: parseFloat(form.precio_noche),
          es_compartido: form.es_compartido === true || form.es_compartido === "true",
        }),
      });
      onCreated();
    } catch (e) { setError(e.message); setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title display">Nueva unidad</h2>
          <button className="modal-close" onClick={onClose}><CloseIcon fontSize="inherit" /></button>
        </div>
        <div className="alert alert-amber">La unidad quedará en revisión hasta ser aprobada.</div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">Nombre</label>
          <input className="form-input" placeholder="Ej: Cabaña Principal" value={form.nombre} onChange={set("nombre")} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select className="form-input form-select" value={form.tipo} onChange={set("tipo")}>
              <option value="habitacion">Habitación</option>
              <option value="cabaña">Cabaña</option>
              <option value="glamping">Glamping</option>
              <option value="apartamento">Apartamento</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Capacidad (personas)</label>
            <input className="form-input" type="number" min={1} value={form.capacidad} onChange={set("capacidad")} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea className="form-input" rows={2} value={form.descripcion} onChange={set("descripcion")} style={{ resize: "vertical" }} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Precio por noche</label>
            <input className="form-input" type="number" min={0} step="1000" placeholder="150000" value={form.precio_noche} onChange={set("precio_noche")} />
          </div>
          <div className="form-group">
            <label className="form-label">¿Compartido?</label>
            <select className="form-input form-select" value={String(form.es_compartido)} onChange={(e) => setForm((f) => ({ ...f, es_compartido: e.target.value === "true" }))}>
              <option value="false">No — privado</option>
              <option value="true">Sí — compartido</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={submit} disabled={loading}>
          {loading ? "Guardando..." : "Crear unidad"}
        </button>
      </div>
    </div>
  );
};