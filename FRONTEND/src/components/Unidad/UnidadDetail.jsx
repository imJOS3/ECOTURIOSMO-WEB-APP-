import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useResenasStore from "../../stores/useResenasStore";
import { Badge, StarRating } from "../common/ui/index";
import { BackIcon, MapIcon } from "../common/icons/icons";
import MediaGallery from "../common/MediaGallery";
import { formatCurrency, getEntityCategories } from "../../utils/media";
import { imagenesService } from "../../services/imagenes.service";
import { apiFetch } from "../../utils/api";

const UnidadDetail = ({ unidad, user, onBack, onReserve }) => {
  const [alojamiento, setAlojamiento] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [newResena, setNewResena] = useState({ calificacion: 5, comentario: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const a = await apiFetch(`/alojamientos/${unidad.id_alojamiento}`);
        setAlojamiento(a?.data || a);
      } catch { /* ignore */ }
      try {
        await useResenasStore.getState().fetchByAlojamiento(unidad.id_alojamiento);
        setResenas(useResenasStore.getState().resenas || []);
      } catch { /* ignore */ }
      try {
        const d = await imagenesService.fetchUnidad(unidad.id);
        setImagenes(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
      } catch { /* ignore */ }
    })();
  }, [unidad.id, unidad.id_alojamiento]);

  const submitResena = async () => {
    try {
      await useResenasStore.getState().createResena({
        alojamiento_id: unidad.id_alojamiento,
        comentario: newResena.comentario,
        puntuacion: newResena.calificacion
      });
      setMsg("¡Reseña publicada!");
      const updated = await useResenasStore.getState().fetchByAlojamiento(unidad.id_alojamiento);
      setResenas(updated);
    } catch (e) { setMsg(e.message); }
  };

  return (
    <div>
      <button className="btn btn-sm" onClick={onBack} style={{ marginBottom: "1.5rem" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><BackIcon fontSize="small" /> Volver</span>
      </button>

      <div className="detail-hero">
        <MediaGallery entity={unidad} images={imagenes} title={unidad.nombre} height={260} compact />
      </div>

      <div className="detail-layout">
        <div>
          {alojamiento && (
            <Link
              to={`/alojamientos/${alojamiento.id}`}
              style={{ fontSize: "0.8rem", color: "var(--green)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 8, textDecoration: "none" }}
            >
              <MapIcon fontSize="small" /> {alojamiento.titulo}
            </Link>
          )}
          <h1 className="display" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{unidad.nombre}</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            {unidad.tipo} · Capacidad {unidad.capacidad}{unidad.es_compartido ? " · compartido" : ""}
          </p>
          <Badge status={unidad.estado || unidad.estado_publicacion} />
          {getEntityCategories(unidad).length > 0 && (
            <div className="tag-row" style={{ marginTop: "0.9rem" }}>
              {getEntityCategories(unidad).map((categoria) => (
                <span key={categoria.id || categoria.nombre} className="tag-pill">{categoria.nombre}</span>
              ))}
            </div>
          )}
          <p style={{ lineHeight: "1.8", margin: "1.5rem 0 2rem" }}>{unidad.descripcion}</p>

          {/* Reseñas (del alojamiento padre) */}
          <div>
            <h3 className="display" style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>
              Reseñas ({resenas.length})
            </h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Reseñas del alojamiento{alojamiento ? ` · ${alojamiento.titulo}` : ""}
            </p>
            {resenas.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Aún no hay reseñas.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "1.5rem" }}>
                {resenas.map((r) => (
                  <div key={r.id} style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <StarRating value={r.calificacion} />
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {new Date(r.fecha).toLocaleDateString("es-CO")}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.875rem" }}>{r.comentario}</p>
                  </div>
                ))}
              </div>
            )}
            {user && (
              <div style={{ background: "var(--card-bg)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem" }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 500, marginBottom: 10 }}>Deja tu reseña</p>
                <div className="form-group">
                  <label className="form-label">Calificación</label>
                  <select
                    className="form-input form-select"
                    value={newResena.calificacion}
                    onChange={(e) => setNewResena((r) => ({ ...r, calificacion: parseInt(e.target.value) }))}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{"★".repeat(n)} {n}/5</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Comentario</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={newResena.comentario}
                    onChange={(e) => setNewResena((r) => ({ ...r, comentario: e.target.value }))}
                    style={{ resize: "vertical" }}
                  />
                </div>
                {msg && <div className={`alert ${msg.includes("!") ? "alert-success" : "alert-error"}`}>{msg}</div>}
                <button className="btn btn-primary btn-sm" onClick={submitResena}>Publicar reseña</button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          <div className="sidebar-card">
            <p className="sidebar-card-title">Reservar</p>
            <p style={{ fontSize: "1.3rem", fontWeight: 500, color: "var(--green)", marginBottom: 4 }}>
              ${formatCurrency(unidad.precio_noche || 0)}
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 400 }}> /noche</span>
            </p>
            {user ? (
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 10 }} onClick={() => onReserve(unidad)}>
                Reservar esta unidad
              </button>
            ) : (
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Inicia sesión para reservar.</p>
            )}
          </div>
          <div className="sidebar-card">
            <p className="sidebar-card-title">Detalles</p>
            <table style={{ width: "100%", fontSize: "0.85rem" }}>
              <tbody>
                <tr>
                  <td style={{ color: "var(--text-muted)", padding: "4px 0" }}>Estado</td>
                  <td style={{ textAlign: "right" }}><Badge status={unidad.estado || unidad.estado_publicacion} /></td>
                </tr>
                <tr>
                  <td style={{ color: "var(--text-muted)", padding: "4px 0" }}>Tipo</td>
                  <td style={{ textAlign: "right" }}>{unidad.tipo}</td>
                </tr>
                <tr>
                  <td style={{ color: "var(--text-muted)", padding: "4px 0" }}>Capacidad</td>
                  <td style={{ textAlign: "right" }}>{unidad.capacidad}</td>
                </tr>
                <tr>
                  <td style={{ color: "var(--text-muted)", padding: "4px 0" }}>Compartido</td>
                  <td style={{ textAlign: "right" }}>{unidad.es_compartido ? "Sí" : "No"}</td>
                </tr>
                <tr>
                  <td style={{ color: "var(--text-muted)", padding: "4px 0" }}>Categorías</td>
                  <td style={{ textAlign: "right" }}>{getEntityCategories(unidad).length}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnidadDetail;