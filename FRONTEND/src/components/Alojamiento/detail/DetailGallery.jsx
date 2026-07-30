import { useMemo, useState } from "react";
import NatureIcons from "../../common/icons/icons.constants";
import { GridIcon } from "../detailIcons";
import { imgUrl } from "./mapUtils";
import {
  ESPACIOS_FOTO,
  DEFAULT_ESPACIO_FOTO,
  labelEspacio,
} from "../../../constants/espaciosFoto";

const randomIcon = (id) => NatureIcons[(id || 0) % NatureIcons.length];

export const DetailGallery = ({ images, seedId, onOpenLightbox }) => {
  const [filter, setFilter] = useState("todas");

  const espaciosPresentes = useMemo(() => {
    const ids = new Set(
      (images || []).map((img) => img.espacio || DEFAULT_ESPACIO_FOTO)
    );
    return ESPACIOS_FOTO.filter((e) => ids.has(e.id));
  }, [images]);

  const filtered = useMemo(() => {
    if (filter === "todas") return images || [];
    return (images || []).filter(
      (img) => (img.espacio || DEFAULT_ESPACIO_FOTO) === filter
    );
  }, [images, filter]);

  const openFiltered = (localIndex) => {
    if (filter === "todas") {
      onOpenLightbox(localIndex);
      return;
    }
    const target = filtered[localIndex];
    const globalIndex = (images || []).findIndex(
      (img) => (img.id && img.id === target?.id) || img.url === target?.url
    );
    onOpenLightbox(globalIndex >= 0 ? globalIndex : 0);
  };

  const showFilters = espaciosPresentes.length > 1;

  if (!images?.length) {
    const FallbackIcon = randomIcon(seedId);
    return (
      <div className="aloj-gallery-single" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="aloj-gallery-fallback">
          <FallbackIcon fontSize="inherit" />
        </span>
      </div>
    );
  }

  return (
    <div>
      {showFilters && (
        <div className="aloj-gallery-filters" role="tablist" aria-label="Filtrar fotos por espacio">
          <button
            type="button"
            className={`aloj-gallery-filter ${filter === "todas" ? "active" : ""}`}
            onClick={() => setFilter("todas")}
          >
            Todas ({images.length})
          </button>
          {espaciosPresentes.map((espacio) => {
            const count = images.filter(
              (img) => (img.espacio || DEFAULT_ESPACIO_FOTO) === espacio.id
            ).length;
            return (
              <button
                key={espacio.id}
                type="button"
                className={`aloj-gallery-filter ${filter === espacio.id ? "active" : ""}`}
                onClick={() => setFilter(espacio.id)}
              >
                {labelEspacio(espacio.id)} ({count})
              </button>
            );
          })}
        </div>
      )}

      {filtered.length > 1 ? (
        <div className="aloj-gallery-grid">
          <div
            className="aloj-gallery-main"
            style={{ backgroundImage: `url(${imgUrl(filtered[0])})` }}
            onClick={() => openFiltered(0)}
          />
          {filtered.slice(1, 5).map((img, i) => (
            <div
              key={img.id || img.url || i}
              className="aloj-gallery-thumb"
              style={{ backgroundImage: `url(${imgUrl(img)})` }}
              onClick={() => openFiltered(i + 1)}
            />
          ))}
          <button className="aloj-gallery-more-btn" onClick={() => openFiltered(0)}>
            <GridIcon size={15} /> Ver las {filtered.length} fotos
            {filter !== "todas" ? ` · ${labelEspacio(filter)}` : ""}
          </button>
        </div>
      ) : (
        <div
          className="aloj-gallery-single"
          style={{ backgroundImage: `url(${imgUrl(filtered[0])})` }}
          onClick={() => openFiltered(0)}
        />
      )}
    </div>
  );
};

export default DetailGallery;
