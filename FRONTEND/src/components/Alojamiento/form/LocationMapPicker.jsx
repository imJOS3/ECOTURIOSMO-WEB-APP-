import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { COLOMBIA_CENTER } from "../../../utils/colombiaPlaces";

const pinIcon = L.divIcon({
  className: "location-map-pin",
  html: `<span class="location-map-pin-dot"></span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const ClickHandler = ({ onPick }) => {
  useMapEvents({
    click(event) {
      onPick?.(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
};

const FlyTo = ({ lat, lng, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    map.flyTo([lat, lng], zoom ?? Math.max(map.getZoom(), 12), { duration: 0.8 });
  }, [lat, lng, zoom, map]);
  return null;
};

/**
 * Mapa clicable: el anfitrión elige el punto exacto sin escribir lat/lng.
 */
export const LocationMapPicker = ({ latitud, longitud, onChange, flyTarget }) => {
  const lat = latitud === "" || latitud == null ? null : Number(latitud);
  const lng = longitud === "" || longitud == null ? null : Number(longitud);
  const hasPoint = Number.isFinite(lat) && Number.isFinite(lng);

  const center = useMemo(() => {
    if (hasPoint) return [lat, lng];
    if (flyTarget && Number.isFinite(flyTarget.lat) && Number.isFinite(flyTarget.lng)) {
      return [flyTarget.lat, flyTarget.lng];
    }
    return [COLOMBIA_CENTER.lat, COLOMBIA_CENTER.lng];
  }, [hasPoint, lat, lng, flyTarget]);

  const handlePick = (nextLat, nextLng) => {
    onChange?.({
      latitud: Number(nextLat.toFixed(6)),
      longitud: Number(nextLng.toFixed(6)),
    });
  };

  return (
    <div className="location-map-picker">
      <div className="location-map-frame">
        <MapContainer
          center={center}
          zoom={hasPoint ? 13 : 6}
          scrollWheelZoom
          className="location-map-leaflet"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={handlePick} />
          {flyTarget?.lat != null && flyTarget?.lng != null && (
            <FlyTo lat={flyTarget.lat} lng={flyTarget.lng} zoom={flyTarget.zoom || 12} />
          )}
          {hasPoint && <Marker position={[lat, lng]} icon={pinIcon} />}
        </MapContainer>
      </div>

      <div className="location-map-meta">
        <p className="form-hint" style={{ margin: 0 }}>
          Haz clic en el mapa para marcar la ubicación exacta del alojamiento.
        </p>
        {hasPoint ? (
          <p className="location-map-coords">
            {lat.toFixed(5)}, {lng.toFixed(5)}
            <button
              type="button"
              className="btn btn-sm"
              style={{ marginLeft: 10 }}
              onClick={() => onChange?.({ latitud: "", longitud: "" })}
            >
              Quitar marcador
            </button>
          </p>
        ) : (
          <p className="form-hint" style={{ margin: 0, color: "var(--amber, #b45309)" }}>
            Aún no hay punto seleccionado
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationMapPicker;
