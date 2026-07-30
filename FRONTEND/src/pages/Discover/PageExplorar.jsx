import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AlojamientoCard from "../../components/Alojamiento/AlojamientoCard";
import { Spinner, EmptyState } from "../../components/common/ui/index";
import { BrandIcon } from "../../components/common/icons/icons";
import { useAlojamientosStore } from "../../stores/useAlojamientosStore";
import { useCategoriasStore } from "../../stores/useCategoriasStore";
import { useServiciosStore } from "../../stores/useServiciosStore";
import ExplorarFilters from "./ExplorarFilters";
import {
  DEFAULT_EXPLORAR_FILTERS,
  computePriceBounds,
  countActiveFilters,
  extractDepartamentosFromList,
  filterAndSortAlojamientos,
  filtersFromSearchParams,
  filtersToSearchParams,
} from "../../utils/explorarFilters";
import "../../styles/explorar.css";

const PageExplorar = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => filtersFromSearchParams(searchParams));
  const [moreOpen, setMoreOpen] = useState(() => countActiveFilters(filtersFromSearchParams(searchParams)) > 0);

  const alojamientos = useAlojamientosStore((state) => state.items);
  const loading = useAlojamientosStore((state) => state.loading);
  const error = useAlojamientosStore((state) => state.error);
  const fetchAlojamientos = useAlojamientosStore((state) => state.fetchAlojamientos);

  const categorias = useCategoriasStore((s) => s.porTipo.alojamiento?.items || []);
  const fetchCategorias = useCategoriasStore((s) => s.fetchCategorias);
  const servicios = useServiciosStore((s) => s.items || []);
  const fetchServicios = useServiciosStore((s) => s.fetchServicios);

  useEffect(() => {
    fetchAlojamientos().catch(() => {});
    fetchCategorias("alojamiento").catch(() => {});
    fetchServicios().catch(() => {});
  }, [fetchAlojamientos, fetchCategorias, fetchServicios]);

  useEffect(() => {
    const params = filtersToSearchParams(filters);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const priceBounds = useMemo(
    () => computePriceBounds(alojamientos),
    [alojamientos]
  );

  const departamentos = useMemo(
    () => extractDepartamentosFromList(alojamientos),
    [alojamientos]
  );

  const categoriasOrdenadas = useMemo(() => {
    const priority = [
      "familiar",
      "ideal para parejas",
      "romántico",
      "romantico",
      "pet friendly",
      "glamping",
      "camping",
      "naturaleza",
      "montaña",
      "montana",
      "bosque",
      "aventura",
      "ecoturismo",
      "habitación privada",
      "habitacion privada",
      "habitación compartida",
      "habitacion compartida",
    ];
    return [...categorias].sort((a, b) => {
      const ia = priority.findIndex((p) => String(a.nombre || "").toLowerCase().includes(p));
      const ib = priority.findIndex((p) => String(b.nombre || "").toLowerCase().includes(p));
      const sa = ia === -1 ? 999 : ia;
      const sb = ib === -1 ? 999 : ib;
      if (sa !== sb) return sa - sb;
      return String(a.nombre || "").localeCompare(String(b.nombre || ""), "es");
    });
  }, [categorias]);

  const serviciosPopulares = useMemo(() => {
    const priority = [
      "wifi",
      "estacionamiento",
      "cocina",
      "jacuzzi",
      "mascotas",
      "playa",
      "montañas",
      "montanas",
      "baño privado",
      "bano privado",
      "aire",
    ];
    return [...servicios].sort((a, b) => {
      const ia = priority.findIndex((p) => String(a.nombre || "").toLowerCase().includes(p));
      const ib = priority.findIndex((p) => String(b.nombre || "").toLowerCase().includes(p));
      const sa = ia === -1 ? 999 : ia;
      const sb = ib === -1 ? 999 : ib;
      if (sa !== sb) return sa - sb;
      return String(a.nombre || "").localeCompare(String(b.nombre || ""), "es");
    });
  }, [servicios]);

  const filtered = useMemo(
    () =>
      filterAndSortAlojamientos(alojamientos, filters, {
        medianPrice: priceBounds.median,
      }),
    [alojamientos, filters, priceBounds.median]
  );

  const resetFilters = () => {
    setFilters({ ...DEFAULT_EXPLORAR_FILTERS });
  };

  return (
    <div className="exp-page">
      <div className="section-header">
        <h2 className="section-title display">Alojamientos ecológicos</h2>
        <span className="section-sub">
          {loading ? "…" : `${filtered.length} disponibles`}
        </span>
      </div>

      <ExplorarFilters
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        departamentos={departamentos}
        categorias={categoriasOrdenadas}
        servicios={serviciosPopulares}
        priceBounds={priceBounds}
        moreOpen={moreOpen}
        onToggleMore={() => setMoreOpen((v) => !v)}
      />

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<BrandIcon fontSize="inherit" />}
          message="No hay alojamientos con esos filtros. Prueba ampliar el precio o quitar alguna categoría."
        />
      ) : (
        <div className="cards-grid">
          {filtered.map((a) => (
            <AlojamientoCard
              key={a.id}
              item={a}
              onClick={(it) => navigate(`/alojamientos/${it.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PageExplorar;
