// src/components/Alojamiento/AlojamientoCard.jsx
import { Badge } from "../common/ui/Badge";
import NatureIcons from "../common/icons/icons.constants";
import { formatCurrency, getEntityCategories, getPrimaryImage } from "../../utils/media";

const randomIcon = (id) => {
  let index;
  if (typeof id === "number") {
    index = id;
  } else if (typeof id === "string") {
    index = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  } else {
    index = 0;
  }
  return NatureIcons[index % NatureIcons.length];
};

/**
 * AlojamientoCard
 *
 * Rediseño: la imagen ocupa más espacio y tiene overlay de gradiente para que
 * el texto sobre ella siempre sea legible; el contador de imágenes es visible
 * de un vistazo; los botones de acción quedan agrupados y no compiten
 * visualmente con el precio. El click en la card abre el detalle; los
 * botones de `actions` usan stopPropagation para no disparar ese click.
 *
 * Props:
 * - item: el alojamiento
 * - onClick: abre el detalle (vista completa)
 * - onImageClick: opcional — si se pasa, un click sobre la imagen abre el
 *   lightbox en vez de navegar al detalle (usar junto con <ImageLightbox/>)
 * - actions: nodo con botones (Editar / Eliminar / Ver como turista, etc.)
 */
const AlojamientoCard = ({ item, onClick, onImageClick, actions }) => {
  const categorias = getEntityCategories(item);
  const primaryImage = getPrimaryImage(item);
  const imageCount = item.imagenes?.length ?? item.imagenes_count ?? null;

  const handleImageClick = (e) => {
    if (!onImageClick) return;
    e.stopPropagation();
    onImageClick(item);
  };

  return (
    <div className="aloj-card" onClick={() => onClick?.(item)}>
      <div
        className="aloj-card-img"
        style={{ backgroundImage: primaryImage ? `url(${primaryImage})` : undefined }}
        onClick={handleImageClick}
      >
        <div className="aloj-card-img-gradient" />
        {!primaryImage && (
          <span className="aloj-card-img-fallback">
            {(() => {
              const Icon = randomIcon(item.id);
              return <Icon fontSize="inherit" />;
            })()}
          </span>
        )}

        <div className="aloj-card-top-row">
          <Badge status={item.estado || item.estado_publicacion} />
          {imageCount != null && imageCount > 0 && (
            <span className="aloj-card-img-count">🖼 {imageCount}</span>
          )}
        </div>

        <div className="aloj-card-bottom-overlay">
          <h3 className="aloj-card-title">{item.titulo}</h3>
          <p className="aloj-card-location">📍 {item.ubicacion}</p>
        </div>
      </div>

      <div className="aloj-card-body">
        {categorias.length > 0 && (
          <div className="tag-row" style={{ marginBottom: 10 }}>
            {categorias.slice(0, 3).map((categoria) => (
              <span key={categoria.id || categoria.nombre} className="tag-pill">{categoria.nombre}</span>
            ))}
          </div>
        )}

        <p className="aloj-card-desc">{item.descripcion}</p>

        <div className="aloj-card-footer">
          <span className="aloj-card-price">
            Desde <strong>${formatCurrency(item.precio_desde || item.precio_noche || 0)}</strong>
            <span className="aloj-card-price-unit">/noche</span>
          </span>
          {actions && (
            <div className="aloj-card-actions" onClick={(e) => e.stopPropagation()}>
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlojamientoCard;