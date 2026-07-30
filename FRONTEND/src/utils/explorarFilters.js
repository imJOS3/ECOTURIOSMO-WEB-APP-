import { COLOMBIA_DEPARTAMENTOS } from "./colombiaPlaces";
import { getEntityCategories } from "./media";

export const DEFAULT_EXPLORAR_FILTERS = {
  q: "",
  departamento: "",
  precioMin: "",
  precioMax: "",
  huespedes: "",
  habitaciones: "",
  privacidad: "todos", // todos | privado | compartido
  categorias: [],
  servicios: [],
  ambiente: "",
  sort: "recientes",
};

export const AMBIENTES = [
  { id: "familiar", label: "Familiar", hint: "Ideal con niños o grupos" },
  { id: "parejas", label: "Para parejas", hint: "Romántico o íntimo" },
  { id: "pet", label: "Pet friendly", hint: "Con mascotas" },
  { id: "naturaleza", label: "Naturaleza", hint: "Bosque, montaña, eco" },
  { id: "glamping", label: "Glamping / camping", hint: "Experiencia outdoor" },
  { id: "aventura", label: "Aventura", hint: "Explorar y actividad" },
  { id: "economico", label: "Económico", hint: "Mejor precio" },
];

export const SORT_OPTIONS = [
  { id: "recientes", label: "Más recientes" },
  { id: "recomendados", label: "Recomendados" },
  { id: "precio_asc", label: "Precio: menor a mayor" },
  { id: "precio_desc", label: "Precio: mayor a menor" },
  { id: "capacidad", label: "Mayor capacidad" },
];

const norm = (value) => String(value || "").toLowerCase().trim();

const getPrecio = (item) => Number(item.precio_noche ?? item.precio_desde ?? 0) || 0;
const getCapacidad = (item) => Number(item.capacidad ?? 0) || 0;
const getHabitaciones = (item) => Number(item.habitaciones ?? 0) || 0;

const categoryNames = (item) =>
  getEntityCategories(item).map((c) => norm(c.nombre));

const categoryIds = (item) =>
  getEntityCategories(item)
    .map((c) => c.id)
    .filter((id) => id != null)
    .map(String);

const servicioIds = (item) =>
  (Array.isArray(item.servicios) ? item.servicios : [])
    .map((s) => (typeof s === "object" ? s.id : s))
    .filter((id) => id != null)
    .map(String);

const servicioNames = (item) =>
  (Array.isArray(item.servicios) ? item.servicios : []).map((s) =>
    norm(typeof s === "object" ? s.nombre : s)
  );

const hasCategoryMatch = (names, keywords) =>
  keywords.some((kw) => names.some((n) => n.includes(kw)));

const matchesAmbiente = (item, ambiente, medianPrice) => {
  if (!ambiente) return true;
  const cats = categoryNames(item);
  const servicios = servicioNames(item);
  const capacidad = getCapacidad(item);
  const precio = getPrecio(item);

  switch (ambiente) {
    case "familiar":
      return hasCategoryMatch(cats, ["familiar"]) || capacidad >= 4;
    case "parejas":
      return (
        hasCategoryMatch(cats, ["pareja", "románt", "romant"]) ||
        (capacidad > 0 && capacidad <= 2)
      );
    case "pet":
      return (
        hasCategoryMatch(cats, ["pet"]) ||
        servicios.some((s) => s.includes("mascota"))
      );
    case "naturaleza":
      return hasCategoryMatch(cats, [
        "naturaleza",
        "bosque",
        "montaña",
        "montana",
        "ecotur",
        "mirador",
        "panorám",
        "panoram",
      ]);
    case "glamping":
      return hasCategoryMatch(cats, ["glamping", "camping"]);
    case "aventura":
      return hasCategoryMatch(cats, ["aventura"]);
    case "economico":
      return precio > 0 && precio <= (medianPrice || precio);
    default:
      return true;
  }
};

const isCompartido = (item) =>
  item.es_compartido === true || item.es_compartido === "true" || item.es_compartido === 1;

const richnessScore = (item) =>
  categoryNames(item).length +
  servicioNames(item).length +
  (item.imagenes?.length || item.imagenes_count || 0);

export const extractDepartamentosFromList = (items) => {
  const found = new Set();
  (items || []).forEach((item) => {
    const ubi = String(item.ubicacion || "");
    COLOMBIA_DEPARTAMENTOS.forEach((dep) => {
      if (ubi.toLowerCase().includes(dep.toLowerCase())) found.add(dep);
    });
  });
  return [...found].sort((a, b) => a.localeCompare(b, "es"));
};

export const computePriceBounds = (items) => {
  const prices = (items || []).map(getPrecio).filter((p) => p > 0);
  if (prices.length === 0) return { min: 0, max: 500000, median: 150000 };
  const sorted = [...prices].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0
      ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
      : sorted[mid];
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    median,
  };
};

export const countActiveFilters = (filters) => {
  let n = 0;
  if (filters.q?.trim()) n += 1;
  if (filters.departamento) n += 1;
  if (filters.precioMin !== "" && filters.precioMin != null) n += 1;
  if (filters.precioMax !== "" && filters.precioMax != null) n += 1;
  if (filters.huespedes) n += 1;
  if (filters.habitaciones) n += 1;
  if (filters.privacidad && filters.privacidad !== "todos") n += 1;
  if (filters.categorias?.length) n += 1;
  if (filters.servicios?.length) n += 1;
  if (filters.ambiente) n += 1;
  return n;
};

export const filterAndSortAlojamientos = (items, filters, options = {}) => {
  const f = { ...DEFAULT_EXPLORAR_FILTERS, ...filters };
  const medianPrice = options.medianPrice ?? computePriceBounds(items).median;
  const q = norm(f.q);

  let list = (items || []).filter(
    (a) => (a.estado || a.estado_publicacion) === "aprobado"
  );

  if (q) {
    list = list.filter((a) => {
      const haystack = [a.titulo, a.ubicacion, a.descripcion, ...categoryNames(a)]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  if (f.departamento) {
    const dep = norm(f.departamento);
    list = list.filter((a) => norm(a.ubicacion).includes(dep));
  }

  const minP = f.precioMin === "" || f.precioMin == null ? null : Number(f.precioMin);
  const maxP = f.precioMax === "" || f.precioMax == null ? null : Number(f.precioMax);
  if (minP != null && !Number.isNaN(minP)) {
    list = list.filter((a) => getPrecio(a) >= minP);
  }
  if (maxP != null && !Number.isNaN(maxP)) {
    list = list.filter((a) => getPrecio(a) > 0 && getPrecio(a) <= maxP);
  }

  if (f.huespedes) {
    const n = Number(f.huespedes);
    if (!Number.isNaN(n) && n > 0) {
      list = list.filter((a) => getCapacidad(a) >= n);
    }
  }

  if (f.habitaciones) {
    const n = Number(f.habitaciones);
    if (!Number.isNaN(n) && n > 0) {
      list = list.filter((a) => getHabitaciones(a) >= n);
    }
  }

  if (f.privacidad === "privado") {
    list = list.filter((a) => !isCompartido(a));
  } else if (f.privacidad === "compartido") {
    list = list.filter((a) => isCompartido(a));
  }

  if (f.categorias?.length) {
    const wanted = f.categorias.map(String);
    list = list.filter((a) => {
      const ids = categoryIds(a);
      return wanted.every((id) => ids.includes(id));
    });
  }

  if (f.servicios?.length) {
    const wanted = f.servicios.map(String);
    list = list.filter((a) => {
      const ids = servicioIds(a);
      return wanted.every((id) => ids.includes(id));
    });
  }

  if (f.ambiente) {
    list = list.filter((a) => matchesAmbiente(a, f.ambiente, medianPrice));
  }

  const sorted = [...list];
  switch (f.sort) {
    case "precio_asc":
      sorted.sort((a, b) => getPrecio(a) - getPrecio(b));
      break;
    case "precio_desc":
      sorted.sort((a, b) => getPrecio(b) - getPrecio(a));
      break;
    case "capacidad":
      sorted.sort((a, b) => getCapacidad(b) - getCapacidad(a));
      break;
    case "recomendados":
      sorted.sort((a, b) => richnessScore(b) - richnessScore(a));
      break;
    case "recientes":
    default:
      sorted.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
      break;
  }

  return sorted;
};

/** Serializa filtros a query string de URL. */
export const filtersToSearchParams = (filters) => {
  const f = { ...DEFAULT_EXPLORAR_FILTERS, ...filters };
  const params = new URLSearchParams();
  if (f.q?.trim()) params.set("q", f.q.trim());
  if (f.departamento) params.set("dep", f.departamento);
  if (f.precioMin !== "" && f.precioMin != null) params.set("pmin", String(f.precioMin));
  if (f.precioMax !== "" && f.precioMax != null) params.set("pmax", String(f.precioMax));
  if (f.huespedes) params.set("huespedes", String(f.huespedes));
  if (f.habitaciones) params.set("hab", String(f.habitaciones));
  if (f.privacidad && f.privacidad !== "todos") params.set("tipo", f.privacidad);
  if (f.categorias?.length) params.set("cat", f.categorias.join(","));
  if (f.servicios?.length) params.set("srv", f.servicios.join(","));
  if (f.ambiente) params.set("ambiente", f.ambiente);
  if (f.sort && f.sort !== "recientes") params.set("sort", f.sort);
  return params;
};

export const filtersFromSearchParams = (searchParams) => {
  const get = (key) => searchParams.get(key) || "";
  const list = (key) =>
    get(key)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  return {
    ...DEFAULT_EXPLORAR_FILTERS,
    q: get("q"),
    departamento: get("dep"),
    precioMin: get("pmin"),
    precioMax: get("pmax"),
    huespedes: get("huespedes"),
    habitaciones: get("hab"),
    privacidad: get("tipo") || "todos",
    categorias: list("cat"),
    servicios: list("srv"),
    ambiente: get("ambiente"),
    sort: get("sort") || "recientes",
  };
};
