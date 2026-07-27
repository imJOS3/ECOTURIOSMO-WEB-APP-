import { useEffect, useState } from "react";
import { baseAlojamiento } from "../../../utils/formHelpers";

export const useAlojamientoForm = (initialData) => {
  const [form, setForm] = useState(() => baseAlojamiento(initialData || {}));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (initialData) setForm(baseAlojamiento(initialData));
  }, [initialData]);

  const updateField = (field, value) => {
    setForm((state) => ({ ...state, [field]: value }));
    setDirty(true);
  };

  const setCategorias = (categorias) => {
    setForm((state) => ({ ...state, categorias }));
    setDirty(true);
  };

  const setServicios = (servicios) => {
    setForm((state) => ({ ...state, servicios }));
    setDirty(true);
  };

  const hydrateForm = (data) => {
    setForm(baseAlojamiento(data || {}));
    setDirty(true);
  };

  const resetForm = () => {
    setForm(baseAlojamiento({}));
    setDirty(false);
  };

  const validate = () => {
    if (!form.titulo.trim()) return "El título es obligatorio";
    if (form.descripcion.trim().length < 10) return "La descripción debe tener al menos 10 caracteres";
    if (!form.ubicacion.trim()) return "La ubicación es obligatoria";
    if (!form.precio_noche || Number(form.precio_noche) <= 0) return "El precio por noche es obligatorio";
    if (!form.capacidad || Number(form.capacidad) < 1) return "La capacidad debe ser al menos 1";
    if (form.categorias.length === 0) return "Selecciona al menos una categoría";
    return "";
  };

  const toOptionalInt = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const n = parseInt(value, 10);
    return Number.isFinite(n) ? n : null;
  };

  const buildPayload = () => ({
    titulo: form.titulo.trim(),
    descripcion: form.descripcion.trim(),
    ubicacion: form.ubicacion.trim(),
    latitud: form.latitud ? parseFloat(form.latitud) : null,
    longitud: form.longitud ? parseFloat(form.longitud) : null,
    precio_noche: parseFloat(form.precio_noche),
    capacidad: parseInt(form.capacidad, 10),
    es_compartido: Boolean(form.es_compartido),
    habitaciones: toOptionalInt(form.habitaciones),
    camas: toOptionalInt(form.camas),
    banos: toOptionalInt(form.banos),
    categorias: form.categorias,
    servicios: form.servicios || [],
  });

  return {
    form,
    updateField,
    setCategorias,
    setServicios,
    hydrateForm,
    resetForm,
    validate,
    buildPayload,
    dirty,
    setDirty,
  };
};

export default useAlojamientoForm;
