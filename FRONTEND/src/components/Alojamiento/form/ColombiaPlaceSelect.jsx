import { useEffect, useMemo, useRef, useState } from "react";
import {
  COLOMBIA_DEPARTAMENTOS,
  filterColombiaPlaces,
  findPlaceByUbicacion,
} from "../../../utils/colombiaPlaces";

/**
 * Combobox de municipios/pueblos de Colombia.
 * Escribe `ubicacion` como "Ciudad, Departamento, Colombia".
 */
export const ColombiaPlaceSelect = ({ value = "", onChange, onPlaceSelected }) => {
  const selected = useMemo(() => findPlaceByUbicacion(value), [value]);
  const [departamento, setDepartamento] = useState(selected?.departamento || "");
  const [query, setQuery] = useState(selected?.ciudad || "");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const place = findPlaceByUbicacion(value);
    if (place) {
      setDepartamento(place.departamento);
      setQuery(place.ciudad);
    } else if (!value) {
      setQuery("");
    } else {
      setQuery(String(value).replace(/,\s*Colombia\s*$/i, ""));
    }
  }, [value]);

  useEffect(() => {
    const onDocClick = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const results = useMemo(
    () => filterColombiaPlaces(query, departamento),
    [query, departamento]
  );

  const pick = (place) => {
    setQuery(place.ciudad);
    setDepartamento(place.departamento);
    setOpen(false);
    onChange?.(place.ubicacion);
    onPlaceSelected?.(place);
  };

  return (
    <div className="colombia-place-select" ref={wrapRef}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Departamento</label>
          <select
            className="form-input form-select"
            value={departamento}
            onChange={(event) => {
              setDepartamento(event.target.value);
              setOpen(true);
            }}
          >
            <option value="">Todos</option>
            {COLOMBIA_DEPARTAMENTOS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ position: "relative" }}>
          <label className="form-label">Ciudad / municipio / pueblo *</label>
          <input
            className="form-input"
            placeholder="Buscar… ej. Salento, Villa de Leyva"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            autoComplete="off"
          />
          {open && (
            <ul className="place-suggest-list" role="listbox">
              {results.length === 0 ? (
                <li className="place-suggest-empty">Sin coincidencias</li>
              ) : (
                results.map((place) => (
                  <li key={place.id}>
                    <button
                      type="button"
                      className="place-suggest-item"
                      onClick={() => pick(place)}
                    >
                      <strong>{place.ciudad}</strong>
                      <span>{place.departamento}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
      {selected && (
        <p className="form-hint" style={{ marginTop: -4 }}>
          Seleccionado: {selected.ubicacion}
        </p>
      )}
    </div>
  );
};

export default ColombiaPlaceSelect;
