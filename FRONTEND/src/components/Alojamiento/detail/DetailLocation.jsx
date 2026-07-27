import { DirectionsIcon, ExpandIcon, HomeMarkerIcon } from "../detailIcons";
import { buildMapEmbedUrl } from "./mapUtils";

export const DetailLocation = ({ ubicacion, approx }) => {
  if (!approx) return null;

  const expandUrl = `https://www.openstreetmap.org/?mlat=${approx.lat}&mlon=${approx.lon}#map=14/${approx.lat}/${approx.lon}`;
  const directionsUrl = `https://www.openstreetmap.org/directions?to=${approx.lat}%2C${approx.lon}`;

  return (
    <div id="sec-ubicacion" style={{ marginBottom: "2rem" }}>
      <h3 className="display" style={{ fontSize: "1.2rem", marginBottom: "4px" }}>
        A dónde irás
      </h3>
      <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
        {ubicacion}
      </p>

      <div className="map-embed-wrap">
        <iframe
          className="map-embed-iframe"
          title="Ubicación aproximada del alojamiento"
          src={buildMapEmbedUrl(approx.lat, approx.lon)}
          loading="lazy"
        />
        <div className="approx-map-marker">
          <HomeMarkerIcon size={17} />
        </div>
        <a
          className="map-expand-btn"
          href={expandUrl}
          target="_blank"
          rel="noreferrer"
          title="Ver mapa en grande"
        >
          <ExpandIcon size={14} />
        </a>
      </div>

      <a href={directionsUrl} target="_blank" rel="noreferrer" className="directions-link">
        <DirectionsIcon size={15} /> Cómo llegar (zona aproximada)
      </a>

      <p className="map-privacy-note">
        Podrás conocer la ubicación exacta una vez que hayas completado la reserva.
      </p>
    </div>
  );
};

export default DetailLocation;
