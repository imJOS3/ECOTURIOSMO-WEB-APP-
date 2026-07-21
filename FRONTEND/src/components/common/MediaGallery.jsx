import { useMemo, useState } from "react";
import { BrandIcon } from "./icons/icons";
import { getPrimaryImage, normalizeImages } from "../../utils/media";

const MediaGallery = ({
  entity,
  images: imagesProp,
  title,
  height = 280,
  compact = false,
  showThumbnails = true,
}) => {
  const images = useMemo(() => normalizeImages(entity).length ? normalizeImages(entity) : (imagesProp || []), [entity, imagesProp]);
  const [index, setIndex] = useState(0);

  const current = images[index]?.url || getPrimaryImage(entity);

  if (!images.length && !current) {
    return (
      <div className="media-placeholder" style={{ minHeight: height }}>
        <div className="media-placeholder-icon"><BrandIcon fontSize="inherit" /></div>
        <p>{title || "Sin imágenes todavía"}</p>
      </div>
    );
  }

  return (
    <div className={`media-gallery ${compact ? "compact" : ""}`}>
      <div className="media-main" style={{ minHeight: height, backgroundImage: current ? `url(${current})` : "none" }}>
        <div className="media-overlay" />
        {images.length > 1 && (
          <>
            <button type="button" className="media-nav media-prev" onClick={() => setIndex((currentIndex) => (currentIndex - 1 + images.length) % images.length)}>
              ‹
            </button>
            <button type="button" className="media-nav media-next" onClick={() => setIndex((currentIndex) => (currentIndex + 1) % images.length)}>
              ›
            </button>
          </>
        )}
      </div>

      {showThumbnails && images.length > 1 && (
        <div className="media-thumbs">
          {images.map((image, thumbIndex) => (
            <button
              type="button"
              key={image.id ?? image.url ?? thumbIndex}
              className={`media-thumb ${index === thumbIndex ? "active" : ""}`}
              onClick={() => setIndex(thumbIndex)}
            >
              <img src={image.url} alt={image.alt || title || "Imagen"} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
