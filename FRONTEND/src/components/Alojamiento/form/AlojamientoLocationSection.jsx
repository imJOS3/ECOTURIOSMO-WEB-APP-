import { useCallback, useState } from "react";
import { MapIcon } from "../../common/icons/icons";
import ColombiaPlaceSelect from "./ColombiaPlaceSelect";
import LocationMapPicker from "./LocationMapPicker";

const geocodePlace = async (place) => {
  const query = encodeURIComponent(`${place.ciudad}, ${place.departamento}, Colombia`);
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=co&q=${query}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data) || !data[0]) return null;
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    zoom: 12,
  };
};

export const AlojamientoLocationSection = ({ form, onChange }) => {
  const [flyTarget, setFlyTarget] = useState(null);
  const [geoStatus, setGeoStatus] = useState("");

  const handlePlaceSelected = useCallback(
    async (place) => {
      setGeoStatus("Centrando mapa en el municipio…");
      try {
        const coords = await geocodePlace(place);
        if (coords) {
          setFlyTarget(coords);
          // Si aún no hay marcador, sugiere el centro del municipio
          if (!form.latitud && !form.longitud) {
            onChange("latitud", Number(coords.lat.toFixed(6)));
            onChange("longitud", Number(coords.lng.toFixed(6)));
          }
          setGeoStatus("");
        } else {
          setGeoStatus("No se pudo ubicar el municipio en el mapa; marca el punto a mano.");
        }
      } catch {
        setGeoStatus("No se pudo ubicar el municipio en el mapa; marca el punto a mano.");
      }
    },
    [form.latitud, form.longitud, onChange]
  );

  return (
    <section style={{ marginBottom: "2rem" }}>
      <h3 className="display" style={{ fontSize: "1.1rem", marginBottom: "0.35rem" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <MapIcon fontSize="small" /> Ubicación
        </span>
      </h3>
      <p className="form-hint" style={{ marginBottom: "1rem" }}>
        Elige municipio en Colombia y marca el punto exacto en el mapa (sin escribir coordenadas).
      </p>

      <ColombiaPlaceSelect
        value={form.ubicacion}
        onChange={(ubicacion) => onChange("ubicacion", ubicacion)}
        onPlaceSelected={handlePlaceSelected}
      />

      {geoStatus && (
        <p className="form-hint" style={{ marginBottom: "0.75rem" }}>
          {geoStatus}
        </p>
      )}

      <label className="form-label" style={{ marginTop: "0.5rem" }}>
        Punto en el mapa
      </label>
      <LocationMapPicker
        latitud={form.latitud}
        longitud={form.longitud}
        flyTarget={flyTarget}
        onChange={({ latitud, longitud }) => {
          onChange("latitud", latitud);
          onChange("longitud", longitud);
        }}
      />
    </section>
  );
};

export default AlojamientoLocationSection;
