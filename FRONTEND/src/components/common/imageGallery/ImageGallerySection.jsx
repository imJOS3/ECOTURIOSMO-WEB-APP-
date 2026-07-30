import { useMemo, useRef } from "react";
import {
  ESPACIOS_FOTO,
  DEFAULT_ESPACIO_FOTO,
  labelEspacio,
} from "../../../constants/espaciosFoto";
import "../../../styles/image-gallery.css";

const GalleryThumbnail = ({
  item,
  index,
  isCover,
  onRemove,
  onSetCover,
  onSetEspacio,
  dragHandlers,
}) => (
  <div
    className={`img-gal-thumb ${isCover ? "is-cover" : ""}`}
    draggable
    onDragStart={dragHandlers.onDragStart(index)}
    onDragOver={dragHandlers.onDragOver(index)}
    onDragEnd={dragHandlers.onDragEnd}
    style={{ backgroundImage: `url(${item.url})` }}
  >
    {isCover && <span className="img-gal-badge">★ Portada</span>}
    <span className="img-gal-space-tag">{labelEspacio(item.espacio)}</span>

    <div className="img-gal-thumb-actions">
      <label className="img-gal-select-wrap" onClick={(e) => e.stopPropagation()}>
        <span className="sr-only">Espacio</span>
        <select
          className="img-gal-select"
          value={item.espacio || DEFAULT_ESPACIO_FOTO}
          onChange={(e) => onSetEspacio(item, e.target.value)}
        >
          {ESPACIOS_FOTO.map((espacio) => (
            <option key={espacio.id} value={espacio.id}>
              {espacio.label}
            </option>
          ))}
        </select>
      </label>
      <div className="img-gal-thumb-btns">
        {!isCover && (
          <button
            type="button"
            className="btn btn-sm"
            onClick={(event) => {
              event.stopPropagation();
              onSetCover(item);
            }}
          >
            Portada
          </button>
        )}
        <button
          type="button"
          className="btn btn-sm"
          onClick={(event) => {
            event.stopPropagation();
            onRemove(item);
          }}
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

export const ImageGallerySection = ({
  gallery,
  coverKey,
  activeEspacio,
  onActiveEspacioChange,
  onAddFiles,
  onRemove,
  onSetCover,
  onSetEspacio,
  dragHandlers,
}) => {
  const fileInputRef = useRef(null);

  const grouped = useMemo(() => {
    const map = new Map(ESPACIOS_FOTO.map((e) => [e.id, []]));
    gallery.forEach((item) => {
      const key = item.espacio || DEFAULT_ESPACIO_FOTO;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    });
    return ESPACIOS_FOTO
      .map((espacio) => ({
        ...espacio,
        items: map.get(espacio.id) || [],
      }))
      .filter((group) => group.items.length > 0);
  }, [gallery]);

  const flatIndexByKey = useMemo(() => {
    const map = new Map();
    gallery.forEach((item, index) => map.set(item.key, index));
    return map;
  }, [gallery]);

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files?.length) onAddFiles(event.dataTransfer.files, activeEspacio);
  };

  return (
    <section className="img-gal">
      <h3 className="display img-gal-title">Fotos por espacio</h3>
      <p className="img-gal-lead">
        Organiza las fotos por zona del alojamiento (habitación, baño, cocina…).
        Elige el espacio abajo y luego agrega las imágenes. La ★ Portada es la que
        aparece en las tarjetas de búsqueda.
      </p>

      <div className="img-gal-chips" role="tablist" aria-label="Espacio para nuevas fotos">
        {ESPACIOS_FOTO.map((espacio) => {
          const count = gallery.filter((i) => (i.espacio || DEFAULT_ESPACIO_FOTO) === espacio.id).length;
          return (
            <button
              key={espacio.id}
              type="button"
              role="tab"
              aria-selected={activeEspacio === espacio.id}
              className={`img-gal-chip ${activeEspacio === espacio.id ? "active" : ""}`}
              onClick={() => onActiveEspacioChange(espacio.id)}
            >
              {espacio.label}
              {count > 0 && <em>{count}</em>}
            </button>
          );
        })}
      </div>

      <div
        className="img-gal-drop"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <strong>Agregar a: {labelEspacio(activeEspacio)}</strong>
        <span>Arrastra imágenes aquí o haz clic para seleccionarlas</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => {
            onAddFiles(event.target.files, activeEspacio);
            event.target.value = "";
          }}
        />
      </div>

      {gallery.length === 0 ? (
        <p className="img-gal-empty">Aún no has agregado fotos.</p>
      ) : (
        <div className="img-gal-groups">
          {grouped.map((group) => (
            <div key={group.id} className="img-gal-group">
              <h4 className="img-gal-group-title">
                {group.label}
                <span>{group.items.length}</span>
              </h4>
              <div className="img-gal-grid">
                {group.items.map((item) => (
                  <GalleryThumbnail
                    key={item.key}
                    item={item}
                    index={flatIndexByKey.get(item.key)}
                    isCover={item.key === coverKey}
                    onRemove={onRemove}
                    onSetCover={onSetCover}
                    onSetEspacio={onSetEspacio}
                    dragHandlers={dragHandlers}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ImageGallerySection;
