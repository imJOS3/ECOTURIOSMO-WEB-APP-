// src/components/alojamientos/form/ImageGallerySection.jsx

import { useRef } from "react";

const GalleryThumbnail = ({ item, index, isCover, onRemove, onSetCover, dragHandlers }) => (
  <div
    draggable
    onDragStart={dragHandlers.onDragStart(index)}
    onDragOver={dragHandlers.onDragOver(index)}
    onDragEnd={dragHandlers.onDragEnd}
    style={{
      position: "relative",
      borderRadius: "var(--radius-sm)",
      overflow: "hidden",
      aspectRatio: "1 / 1",
      backgroundImage: `url(${item.url})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      border: isCover ? "2px solid var(--green)" : "1px solid var(--border)",
      cursor: "grab",
    }}
  >
    {isCover && (
      <span
        style={{
          position: "absolute",
          top: 6,
          left: 6,
          background: "var(--green)",
          color: "#fff",
          fontSize: "0.65rem",
          padding: "2px 6px",
          borderRadius: 999,
        }}
      >
        ★ Portada
      </span>
    )}
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-between",
        padding: "4px",
        background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
      }}
    >
      {!isCover && (
        <button
          type="button"
          className="btn btn-sm"
          style={{ fontSize: "0.65rem", padding: "2px 6px" }}
          onClick={(event) => { event.stopPropagation(); onSetCover(item); }}
        >
          Hacer portada
        </button>
      )}
      <button
        type="button"
        className="btn btn-sm"
        style={{ fontSize: "0.65rem", padding: "2px 6px", marginLeft: "auto" }}
        onClick={(event) => { event.stopPropagation(); onRemove(item); }}
      >
        Eliminar
      </button>
    </div>
  </div>
);

export const ImageGallerySection = ({ gallery, coverKey, onAddFiles, onRemove, onSetCover, dragHandlers }) => {
  const fileInputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files?.length) onAddFiles(event.dataTransfer.files);
  };

  return (
    <section style={{ marginBottom: "2rem" }}>
      <h3 className="display" style={{ fontSize: "1.1rem", marginBottom: "0.4rem" }}>Catálogo de imágenes</h3>
      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
        Arrastra las fotos para reordenarlas. La primera imagen (⭐ Portada) es la que se muestra
        en las tarjetas de búsqueda.
      </p>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: "2px dashed var(--border)",
          borderRadius: "var(--radius)",
          padding: "1.5rem",
          textAlign: "center",
          cursor: "pointer",
          color: "var(--text-muted)",
          marginBottom: "1rem",
        }}
      >
        Arrastra imágenes aquí o haz clic para seleccionarlas
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => { onAddFiles(event.target.files); event.target.value = ""; }}
        />
      </div>

      {gallery.length === 0 ? (
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Aún no has agregado fotos.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
          {gallery.map((item, index) => (
            <GalleryThumbnail
              key={item.key}
              item={item}
              index={index}
              isCover={item.key === coverKey}
              onRemove={onRemove}
              onSetCover={onSetCover}
              dragHandlers={dragHandlers}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ImageGallerySection;