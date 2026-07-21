// src/components/AlojamientoDetail.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUnidadesStore } from "../../stores/useUnidadesStore";
import useResenasStore from "../../stores/useResenasStore";
import { Badge, StarRating } from "../common/ui/index";
import NatureIcons from "../common/icons/icons.constants";
import { BackIcon, MapIcon } from "../common/icons/icons";
import MediaGallery from "../common/MediaGallery";
import { formatCurrency, getEntityCategories, getPrimaryImage } from "../../utils/media";
import { imagenesService } from "../../services/imagenes.service";

const randomIcon = (id) => NatureIcons[(id || 0) % NatureIcons.length];

const AlojamientoDetail = ({ item, user, onBack, onReserve }) => {
  const navigate = useNavigate();
  const [resenas, setResenas] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [newResena, setNewResena] = useState({ calificacion: 5, comentario: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await useResenasStore.getState().fetchByAlojamiento(item.id);
        setResenas(useResenasStore.getState().resenas || []);
      } catch { /* ignore */ }
      try {
        await useUnidadesStore.getState().fetchByAlojamiento(item.id);
        setUnidades(useUnidadesStore.getState().items || []);
      } catch { /* ignore */ }
      try {
        const d = await imagenesService.fetchAlojamiento(item.id);
        setImagenes(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
      } catch { /* ignore */ }
    })();
  }, [item.id]);

  const submitResena = async () => {
    try {
      await useResenasStore.getState().createResena({ alojamiento_id: item.id, comentario: newResena.comentario, puntuacion: newResena.calificacion });
      setMsg("¡Reseña publicada!");
      const updated = await useResenasStore.getState().fetchByAlojamiento(item.id);
      setResenas(updated);
    } catch (e) { setMsg(e.message); }
  };

  return (
    <div>
      <button className="btn btn-sm" onClick={onBack} style={{ marginBottom: "1.5rem" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><BackIcon fontSize="small" /> Volver</span>
      </button>

      <div className="detail-hero">
        <MediaGallery entity={item} images={imagenes} title={item.titulo} height={260} compact />
      </div>

      <div className="detail-layout">
        <div>
          <h1 className="display" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{item.titulo}</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem", display: "inline-flex", alignItems: "center", gap: 6 }}><MapIcon fontSize="small" /> {item.ubicacion}</p>
          <Badge status={item.estado || item.estado_publicacion} />
          {getEntityCategories(item).length > 0 && (
            <div className="tag-row" style={{ marginTop: "0.9rem" }}>
              {getEntityCategories(item).map((categoria) => (
                <span key={categoria.id || categoria.nombre} className="tag-pill">{categoria.nombre}</span>
              ))}
            </div>
          )}
          <p style={{ lineHeight: "1.8", margin: "1.5rem 0 2rem" }}>{item.descripcion}</p>

          {unidades.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <h3 className="display" style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Unidades disponibles</h3>
              {unidades.map((u) => (
                <div
                      key={u.id}
                      className="unit-row unit-row-media"
                      onClick={() => navigate(`/alojamientos/${item.id}/unidades/${u.id}`)}
                    >
                  <div className="unit-row-image" style={{ backgroundImage: getPrimaryImage(u) ? `url(${getPrimaryImage(u)})` : undefined }}>
                    {!getPrimaryImage(u) && (
                      <span style={{ position: "relative", zIndex: 1 }}>
                        {(() => {
                          const Icon = randomIcon(u.id);
                          return <Icon fontSize="inherit" />;
                        })()}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                      <div>
                        <span style={{ fontWeight: 500 }}>{u.nombre}</span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: 8 }}>
                          {u.tipo} · Cap. {u.capacidad}{u.es_compartido ? " · compartido" : ""}
                        </span>
                      </div>
                      <span style={{ color: "var(--green)", fontWeight: 500 }}>
                        ${formatCurrency(u.precio_noche || 0)}/noche
                      </span>
                    </div>
                    {getEntityCategories(u).length > 0 && (
                      <div className="tag-row" style={{ marginTop: 8 }}>
                        {getEntityCategories(u).slice(0, 4).map((categoria) => (
                          <span key={categoria.id || categoria.nombre} className="tag-pill">{categoria.nombre}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ marginTop: 4 }}><Badge status={u.estado || u.estado_publicacion} /></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reseñas */}
          <div>
            <h3 className="display" style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
              Reseñas ({resenas.length})
            </h3>
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
            {user ? (
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => onReserve(item)}>
                Seleccionar unidad y reservar
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
                  <td style={{ textAlign: "right" }}><Badge status={item.estado || item.estado_publicacion} /></td>
                </tr>
                {item.latitud && (
                  <tr>
                    <td style={{ color: "var(--text-muted)", padding: "4px 0" }}>Coordenadas</td>
                    <td style={{ textAlign: "right", fontSize: "0.75rem" }}>
                      {parseFloat(item.latitud).toFixed(4)}, {parseFloat(item.longitud).toFixed(4)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td style={{ color: "var(--text-muted)", padding: "4px 0" }}>Unidades</td>
                  <td style={{ textAlign: "right" }}>{unidades.length}</td>
                </tr>
                <tr>
                  <td style={{ color: "var(--text-muted)", padding: "4px 0" }}>Categorías</td>
                  <td style={{ textAlign: "right" }}>{getEntityCategories(item).length}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlojamientoDetail;