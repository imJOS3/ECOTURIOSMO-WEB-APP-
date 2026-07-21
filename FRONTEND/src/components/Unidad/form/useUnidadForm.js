// src/components/Unidad/form/useUnidadForm.js
import { useEffect, useState } from "react";
import { baseUnidad } from "../../../utils/formHelpers";

export const useUnidadForm = (initialData) => {
  const [form, setForm] = useState(() => baseUnidad(initialData || {}));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (initialData) setForm(baseUnidad(initialData));
  }, [initialData]);

  const updateField = (field, value) => {
    setForm((state) => ({ ...state, [field]: value }));
    setDirty(true);
  };

  const setCategorias = (categorias) => {
    setForm((state) => ({ ...state, categorias }));
    setDirty(true);
  };

  const validate = () => {
    if (!form.nombre.trim() || !form.precio_noche) return "Nombre y precio son obligatorios";
    if (form.categorias.length === 0) return "Selecciona al menos una categoría";
    return "";
  };

  const buildPayload = (alojamientoId) => ({
    id_alojamiento: alojamientoId,
    nombre: form.nombre.trim(),
    tipo: form.tipo,
    descripcion: form.descripcion.trim(),
    capacidad: parseInt(form.capacidad, 10) || 1,
    cupos_disponibles: parseInt(form.cupos_disponibles, 10) || parseInt(form.capacidad, 10) || 1,
    precio_noche: parseFloat(form.precio_noche),
    es_compartido: Boolean(form.es_compartido),
    categorias: form.categorias,
  });

  return { form, updateField, setCategorias, validate, buildPayload, dirty, setDirty };
};

export default useUnidadForm;