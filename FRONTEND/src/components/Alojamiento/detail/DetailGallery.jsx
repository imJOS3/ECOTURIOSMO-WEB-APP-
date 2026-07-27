import NatureIcons from "../../common/icons/icons.constants";
import { GridIcon } from "../detailIcons";
import { imgUrl } from "./mapUtils";

const randomIcon = (id) => NatureIcons[(id || 0) % NatureIcons.length];

export const DetailGallery = ({ images, seedId, onOpenLightbox }) => {
  if (images.length > 1) {
    return (
      <div className="aloj-gallery-grid">
        <div
          className="aloj-gallery-main"
          style={{ backgroundImage: `url(${imgUrl(images[0])})` }}
          onClick={() => onOpenLightbox(0)}
        />
        {images.slice(1, 5).map((img, i) => (
          <div
            key={img.id || img.url || i}
            className="aloj-gallery-thumb"
            style={{ backgroundImage: `url(${imgUrl(img)})` }}
            onClick={() => onOpenLightbox(i + 1)}
          />
        ))}
        <button className="aloj-gallery-more-btn" onClick={() => onOpenLightbox(0)}>
          <GridIcon size={15} /> Ver las {images.length} fotos
        </button>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div
        className="aloj-gallery-single"
        style={{ backgroundImage: `url(${imgUrl(images[0])})` }}
        onClick={() => onOpenLightbox(0)}
      />
    );
  }

  const FallbackIcon = randomIcon(seedId);
  return (
    <div className="aloj-gallery-single" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span className="aloj-gallery-fallback">
        <FallbackIcon fontSize="inherit" />
      </span>
    </div>
  );
};

export default DetailGallery;
