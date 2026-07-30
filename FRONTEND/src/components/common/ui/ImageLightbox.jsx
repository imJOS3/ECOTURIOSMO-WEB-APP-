import { useEffect, useCallback, useMemo } from "react";
import { labelEspacio } from "../../../constants/espaciosFoto";

/**
 * ImageLightbox — ver fotos en grande; muestra el espacio si existe.
 */
const ImageLightbox = ({ images, index, onClose, onIndexChange }) => {
  const isOpen = Array.isArray(images) && images.length > 0 && index != null;

  const goNext = useCallback(() => {
    if (!isOpen) return;
    onIndexChange((index + 1) % images.length);
  }, [isOpen, index, images, onIndexChange]);

  const goPrev = useCallback(() => {
    if (!isOpen) return;
    onIndexChange((index - 1 + images.length) % images.length);
  }, [isOpen, index, images, onIndexChange]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose, goNext, goPrev]);

  const current = isOpen ? images[index] : null;
  const src = typeof current === "string" ? current : current?.url || current?.imagen_url;
  const espacioLabel = useMemo(() => {
    if (!current || typeof current === "string") return null;
    return current.espacio ? labelEspacio(current.espacio) : null;
  }, [current]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem",
      }}
    >
      <button
        onClick={onClose}
        aria-label="Cerrar"
        style={{
          position: "absolute", top: 18, right: 22, background: "none", border: "none",
          color: "#fff", fontSize: "1.8rem", lineHeight: 1, cursor: "pointer",
        }}
      >
        ×
      </button>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          aria-label="Anterior"
          style={{
            position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.12)", border: "none", color: "#fff",
            width: 42, height: 42, borderRadius: "50%", fontSize: "1.4rem", cursor: "pointer",
          }}
        >
          ‹
        </button>
      )}

      <div onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
        {espacioLabel && (
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem", marginBottom: 10 }}>
            {espacioLabel}
          </p>
        )}
        <img
          src={src}
          alt={espacioLabel || ""}
          style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain", borderRadius: 8 }}
        />
      </div>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          aria-label="Siguiente"
          style={{
            position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.12)", border: "none", color: "#fff",
            width: 42, height: 42, borderRadius: "50%", fontSize: "1.4rem", cursor: "pointer",
          }}
        >
          ›
        </button>
      )}

      {images.length > 1 && (
        <div
          style={{
            position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.75)", fontSize: "0.8rem",
          }}
        >
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;
