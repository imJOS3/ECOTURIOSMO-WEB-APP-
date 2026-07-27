import { StarRating } from "../../common/ui/index";
import { LeafBadgeIcon } from "../detailIcons";

export const DetailHighlightStrip = ({ avgRating, reviewCount, esFavorito }) => {
  if (!reviewCount) return null;

  return (
    <div className="highlight-strip">
      {esFavorito && (
        <div className="highlight-strip-item highlight-strip-favorito">
          <LeafBadgeIcon size={24} />
          <span>Favorito entre viajeros</span>
        </div>
      )}
      <div className="highlight-strip-item highlight-strip-text">
        Según las reseñas, uno de los alojamientos mejor valorados de la comunidad.
      </div>
      <div className="highlight-strip-item highlight-strip-rating">
        <span className="highlight-strip-rating-num">{avgRating}</span>
        <StarRating value={parseFloat(avgRating)} />
      </div>
      <div className="highlight-strip-item highlight-strip-count">
        <span className="highlight-strip-rating-num">{reviewCount}</span>
        <span>Reseña{reviewCount !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
};

export default DetailHighlightStrip;
