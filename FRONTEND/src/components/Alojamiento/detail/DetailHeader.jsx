import { Badge } from "../../common/ui/index";
import { MapIcon } from "../../common/icons/icons";
import { ShareIcon, HeartIcon, StarFillIcon } from "../detailIcons";

const RatingBadge = ({ avgRating, reviewCount }) => {
  if (!avgRating) return null;
  return (
    <span className="aloj-detail-rating">
      <StarFillIcon size={14} /> {avgRating} · {reviewCount} reseña{reviewCount !== 1 ? "s" : ""}
    </span>
  );
};

export const DetailHeader = ({
  titulo,
  metaStats,
  ubicacion,
  estado,
  avgRating,
  reviewCount,
  copied,
  saved,
  onShare,
  onToggleSave,
}) => (
  <div className="aloj-detail-header">
    <div>
      <h1 className="display aloj-detail-title">{titulo}</h1>
      {metaStats.length > 0 && (
        <p className="aloj-detail-substats">{metaStats.join(" · ")}</p>
      )}
      <div className="aloj-detail-meta">
        <RatingBadge avgRating={avgRating} reviewCount={reviewCount} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <MapIcon fontSize="small" /> {ubicacion}
        </span>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button className="icon-action-btn" onClick={onShare} title="Compartir">
        <ShareIcon size={17} />
        <span>{copied ? "¡Copiado!" : "Compartir"}</span>
      </button>
      <button
        className={`icon-action-btn ${saved ? "icon-action-btn-active" : ""}`}
        onClick={onToggleSave}
        title="Guardar"
      >
        <HeartIcon size={17} filled={saved} />
        <span>{saved ? "Guardado" : "Guardar"}</span>
      </button>
      <Badge status={estado} />
    </div>
  </div>
);

export default DetailHeader;
