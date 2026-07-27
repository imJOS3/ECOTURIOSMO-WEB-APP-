import { useState, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAlojamientosStore } from "../../../../stores/useAlojamientosStore";
import { Spinner, EmptyState } from "../../../../components/common/ui/index";
import ImageLightbox from "../../../../components/common/ui/ImageLightbox";
import AlojamientoCard from "../../../../components/Alojamiento/AlojamientoCard";
import { HomeIcon } from "../../../../components/common/icons/icons";
import "../../../../styles/aloj-card.css";

/**
 * Tab: Alojamientos (vista panel)
 * - anfitrion: ve solo los suyos (fetchMine), puede crear/editar/eliminar,
 *   y previsualizar "como turista" (vista pública de solo lectura).
 * - admin: ve todos (fetchAlojamientos), solo lectura + acceso a moderación
 *   (la acción de aprobar vive en la tab "Mod. Alojamientos").
 */
const TabAlojamientosPanel = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [alojamientos, setAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [lightbox, setLightbox] = useState(null); // { images: [...], index: 0 } | null

  const isAnfitrion = user.rol === "anfitrion";

  const load = useCallback(async () => {
    setLoading(true); setMsg("");
    try {
      if (isAnfitrion) {
        await useAlojamientosStore.getState().fetchMine();
      } else {
        await useAlojamientosStore.getState().fetchAlojamientos();
      }
      setAlojamientos(useAlojamientosStore.getState().items || []);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }, [isAnfitrion]);

  useEffect(() => { load(); }, [load]);

  const deleteAlojamiento = async (id) => {
    if (!confirm("¿Eliminar este alojamiento? Esta acción no se puede deshacer.")) return;
    try {
      await useAlojamientosStore.getState().removeAlojamiento(id);
      load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const openLightbox = (item) => {
    const images = Array.isArray(item.imagenes) && item.imagenes.length > 0
      ? item.imagenes
      : item.imagen_url
        ? [item.imagen_url]
        : [];
    if (images.length === 0) return;
    setLightbox({ images, index: 0 });
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {msg && <div className="alert alert-error" style={{ marginBottom: "1rem" }}>{msg}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <h2 className="display" style={{ fontSize: "1.25rem" }}>
            {isAnfitrion ? "Mis alojamientos" : "Todos los alojamientos"}
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            {alojamientos.length} alojamiento{alojamientos.length !== 1 ? "s" : ""}
          </p>
        </div>
        {isAnfitrion && (
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/panel/alojamientos/nuevo")}>
            + Nuevo alojamiento
          </button>
        )}
      </div>

      {alojamientos.length === 0 ? (
        <EmptyState
          icon={<HomeIcon fontSize="inherit" />}
          message={isAnfitrion ? "Aún no has publicado ningún alojamiento." : "No hay alojamientos registrados."}
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {alojamientos.map((item) => (
            <AlojamientoCard
              key={item.id}
              item={item}
              onClick={() => navigate(`/alojamientos/${item.id}`)}
              onImageClick={openLightbox}
              actions={isAnfitrion ? (
                <>
                  <button
                    className="btn btn-sm"
                    onClick={() => navigate(`/alojamientos/${item.id}`)}
                    title="Ver como la vería un turista"
                  >
                    Ver como turista
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => navigate(`/panel/alojamientos/${item.id}/editar`)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteAlojamiento(item.id)}
                  >
                    Eliminar
                  </button>
                </>
              ) : null}
            />
          ))}
        </div>
      )}

      <ImageLightbox
        images={lightbox?.images}
        index={lightbox?.index}
        onClose={() => setLightbox(null)}
        onIndexChange={(i) => setLightbox((s) => ({ ...s, index: i }))}
      />
    </div>
  );
};

export default TabAlojamientosPanel;