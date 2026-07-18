// src/components/ReserveModal.jsx
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
import { CloseIcon, SuccessIcon } from "./icons";
import UnidadCard from "./Unidad/UnidadCard";
import { imagenesService } from "../services/imagenes.service";

const ReserveModal = ({ alojamiento, onClose }) => {
  const [unidades, setUnidades] = useState([]);
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [form, setForm] = useState({ fecha_inicio: "", fecha_fin: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    apiFetch(`/unidades/alojamiento/${alojamiento.id}`)
      .then(async (d) => {
        const list = Array.isArray(d.data) ? d.data : [];
        const withImages = await Promise.all(list.map(async (unidad) => {
          try {
            const images = await imagenesService.fetchUnidad(unidad.id);
            return { ...unidad, imagenes: Array.isArray(images) ? images : Array.isArray(images?.data) ? images.data : [] };
          } catch {
            return unidad;
          }
        }));
        setUnidades(withImages);
      })
      .catch(() => {});
  }, [alojamiento.id]);

  const noches = form.fecha_inicio && form.fecha_fin
    ? Math.max(0, Math.round((new Date(form.fecha_fin) - new Date(form.fecha_inicio)) / 86400000))
    : 0;
  const total = selectedUnidad ? noches * parseFloat(selectedUnidad.precio_noche || 0) : 0;

  const submit = async () => {
    if (!selectedUnidad) { setMsg("Selecciona una unidad"); return; }
    if (!form.fecha_inicio || !form.fecha_fin) { setMsg("Completa las fechas"); return; }
    setLoading(true); setMsg("");
    try {
      await apiFetch("/reservas", {
        method: "POST",
        body: JSON.stringify({ id_unidad: selectedUnidad.id, ...form }),
      });
      setDone(true);
    } catch (e) { setMsg(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title display">Reservar</h2>
          <button className="modal-close" onClick={onClose}><CloseIcon fontSize="inherit" /></button>
        </div>

        {done ? (
          <div>
            <div className="alert alert-success"><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><SuccessIcon fontSize="small" /> ¡Reserva creada! Queda en estado pendiente.</span></div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={onClose}>Cerrar</button>
          </div>
        ) : (
          <>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
              {alojamiento.titulo} · {alojamiento.ubicacion}
            </p>

            {unidades.length === 0 ? (
              <div className="alert alert-info">No hay unidades disponibles para este alojamiento.</div>
            ) : (
              <>
                <p className="form-label" style={{ marginBottom: "8px" }}>Selecciona una unidad</p>
                <div className="unidad-grid">
                  {unidades.map((u) => (
                    <UnidadCard
                      key={u.id}
                      unidad={u}
                      selected={selectedUnidad?.id === u.id}
                      onClick={setSelectedUnidad}
                    />
                  ))}
                </div>

                <div className="form-row" style={{ marginTop: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Entrada</label>
                    <input type="date" className="form-input" value={form.fecha_inicio} onChange={set("fecha_inicio")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Salida</label>
                    <input type="date" className="form-input" value={form.fecha_fin} onChange={set("fecha_fin")} />
                  </div>
                </div>

                {noches > 0 && selectedUnidad && (
                  <div className="alert alert-info">
                    {noches} {noches === 1 ? "noche" : "noches"} · Total estimado: <strong>${total.toFixed(0)}</strong>
                  </div>
                )}
              </>
            )}

            {msg && <div className="alert alert-error">{msg}</div>}
            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "0.5rem" }}
              onClick={submit}
              disabled={loading || !selectedUnidad || !form.fecha_inicio || !form.fecha_fin}
            >
              {loading ? "Procesando..." : "Confirmar reserva"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReserveModal;