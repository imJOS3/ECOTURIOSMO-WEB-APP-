import { useState } from "react";
import { CloseIcon, SuccessIcon } from "../common/icons/icons";
import useReservasStore from "../../stores/useReservasStore";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("es-CO", { maximumFractionDigits: 0 });

const ReserveModal = ({ alojamiento, onClose }) => {
  const createReserva = useReservasStore((state) => state.createReserva);
  const [form, setForm] = useState({ fecha_inicio: "", fecha_fin: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const noches =
    form.fecha_inicio && form.fecha_fin
      ? Math.max(
          0,
          Math.round((new Date(form.fecha_fin) - new Date(form.fecha_inicio)) / 86400000)
        )
      : 0;

  const total = noches * parseFloat(alojamiento?.precio_noche || 0);

  const submit = async () => {
    if (!form.fecha_inicio || !form.fecha_fin) {
      setMsg("Completa las fechas");
      return;
    }
    if (noches <= 0) {
      setMsg("La fecha de salida debe ser posterior a la de entrada");
      return;
    }

    setLoading(true);
    setMsg("");
    try {
      await createReserva({
        id_alojamiento: alojamiento.id,
        fecha_inicio: form.fecha_inicio,
        fecha_fin: form.fecha_fin,
      });
      setDone(true);
    } catch (error) {
      setMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title display">Reservar</h2>
          <button className="modal-close" onClick={onClose}>
            <CloseIcon fontSize="inherit" />
          </button>
        </div>

        {done ? (
          <div>
            <div className="alert alert-success">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <SuccessIcon fontSize="small" /> ¡Reserva creada! Queda en estado pendiente.
              </span>
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={onClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
              {alojamiento.titulo} · {alojamiento.ubicacion}
            </p>

            <div className="alert alert-info" style={{ marginBottom: "1rem" }}>
              ${formatCurrency(alojamiento.precio_noche)} / noche
              {alojamiento.capacidad ? ` · hasta ${alojamiento.capacidad} huéspedes` : ""}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Entrada</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.fecha_inicio}
                  onChange={set("fecha_inicio")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Salida</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.fecha_fin}
                  onChange={set("fecha_fin")}
                />
              </div>
            </div>

            {noches > 0 && (
              <div className="alert alert-info">
                {noches} {noches === 1 ? "noche" : "noches"} · Total estimado:{" "}
                <strong>${formatCurrency(total)}</strong>
              </div>
            )}

            {msg && <div className="alert alert-error">{msg}</div>}

            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "0.5rem" }}
              onClick={submit}
              disabled={loading || !form.fecha_inicio || !form.fecha_fin}
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
