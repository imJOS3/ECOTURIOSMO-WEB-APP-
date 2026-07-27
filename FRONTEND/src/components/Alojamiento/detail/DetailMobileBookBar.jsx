import { formatCurrency } from "../../../utils/media";
import { StarFillIcon } from "../detailIcons";

export const DetailMobileBookBar = ({ precioNoche, avgRating, onReserve }) => (
  <div className="mobile-book-bar">
    <div>
      <div style={{ fontWeight: 700 }}>
        ${formatCurrency(precioNoche)}
        <span style={{ fontWeight: 400, fontSize: "0.75rem" }}> / noche</span>
      </div>
      {avgRating && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <StarFillIcon size={11} /> {avgRating}
        </div>
      )}
    </div>
    <button className="btn btn-primary" onClick={onReserve}>
      Reservar
    </button>
  </div>
);

export default DetailMobileBookBar;
