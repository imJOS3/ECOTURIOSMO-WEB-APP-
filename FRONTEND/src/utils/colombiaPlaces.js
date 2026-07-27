import colombiaRaw from "../data/colombia-municipios.json";

/** Lista plana: "Municipio, Departamento" para búsqueda y selección. */
export const COLOMBIA_PLACES = colombiaRaw.flatMap((entry) =>
  (entry.ciudades || []).map((ciudad) => {
    const departamento = entry.departamento;
    const label = `${ciudad}, ${departamento}`;
    return {
      id: `${departamento}::${ciudad}`,
      ciudad,
      departamento,
      label,
      ubicacion: `${label}, Colombia`,
    };
  })
).sort((a, b) => a.label.localeCompare(b.label, "es"));

export const COLOMBIA_DEPARTAMENTOS = [
  ...new Set(COLOMBIA_PLACES.map((place) => place.departamento)),
].sort((a, b) => a.localeCompare(b, "es"));

export const findPlaceByUbicacion = (ubicacion = "") => {
  const normalized = String(ubicacion).trim().toLowerCase();
  if (!normalized) return null;

  return (
    COLOMBIA_PLACES.find((place) => place.ubicacion.toLowerCase() === normalized) ||
    COLOMBIA_PLACES.find((place) => normalized.startsWith(place.label.toLowerCase())) ||
    null
  );
};

export const filterColombiaPlaces = (query = "", departamento = "") => {
  const q = String(query).trim().toLowerCase();
  let list = COLOMBIA_PLACES;

  if (departamento) {
    list = list.filter((place) => place.departamento === departamento);
  }

  if (!q) return list.slice(0, 80);

  return list
    .filter(
      (place) =>
        place.ciudad.toLowerCase().includes(q) ||
        place.departamento.toLowerCase().includes(q) ||
        place.label.toLowerCase().includes(q)
    )
    .slice(0, 80);
};

/** Centro aproximado de Colombia. */
export const COLOMBIA_CENTER = { lat: 4.5709, lng: -74.2973 };
