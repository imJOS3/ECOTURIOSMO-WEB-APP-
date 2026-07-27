import { formatCurrency } from "../../../utils/media";
import { StarFillIcon } from "../detailIcons";

export const DetailBookingSidebar = ({
  precioNoche,
  avgRating,
  reviewCount,
  coords,
  categoriasCount,
  serviciosCount = 0,
  user,
  onReserve,
}) => (
  <div className="detail-sidebar">
    <div className="aloj-sidebar-sticky">
      <div className="aloj-price-card">
        <div className="aloj-price-card-amount">
          ${formatCurrency(precioNoche)}
          <span> / noche</span>
        </div>
        {avgRating && (
          <div
            style={{
              marginTop: 6,
              fontSize: "0.85rem",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <StarFillIcon size={13} /> {avgRating} · {reviewCount} reseña
            {reviewCount !== 1 ? "s" : ""}
          </div>
        )}
        <div style={{ marginTop: "1rem" }}>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={onReserve}>
            Reservar
          </button>
          {!user && (
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Inicia sesión para completar tu reserva
            </p>
          )}
        </div>
      </div>

      <div className="sidebar-card" style={{ marginTop: "1rem" }}>
        <p className="sidebar-card-title">Detalles</p>
        <table style={{ width: "100%", fontSize: "0.85rem" }}>
          <tbody>
            {coords?.lat != null && (
              <tr>
                <td style={{ color: "var(--text-muted)", padding: "4px 0" }}>Coordenadas</td>
                <td style={{ textAlign: "right", fontSize: "0.75rem" }}>
                  {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}
                </td>
              </tr>
            )}
            <tr>
              <td style={{ color: "var(--text-muted)", padding: "4px 0" }}>Categorías</td>
              <td style={{ textAlign: "right" }}>{categoriasCount}</td>
            </tr>
            <tr>
              <td style={{ color: "var(--text-muted)", padding: "4px 0" }}>Servicios</td>
              <td style={{ textAlign: "right" }}>{serviciosCount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default DetailBookingSidebar;
