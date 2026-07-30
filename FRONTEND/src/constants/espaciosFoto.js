/** Espacios / zonas de un alojamiento para clasificar fotos. */
export const ESPACIOS_FOTO = [
  { id: "general", label: "General / portada" },
  { id: "exterior", label: "Exterior" },
  { id: "sala", label: "Sala" },
  { id: "comedor", label: "Comedor" },
  { id: "cocina", label: "Cocina" },
  { id: "habitacion", label: "Habitación" },
  { id: "bano", label: "Baño" },
  { id: "otro", label: "Otro" },
];

export const DEFAULT_ESPACIO_FOTO = "general";

export const labelEspacio = (id) =>
  ESPACIOS_FOTO.find((e) => e.id === id)?.label || "Otro";
