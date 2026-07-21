// src/components/alojamientos/form/useAlojamientoForm.js
//
// Única responsabilidad: estado de los campos del formulario, su validación
// y el payload que se envía al backend. No sabe nada de imágenes ni de red.
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

  const validate = () => {
    if (!form.titulo.trim()) return "El título es obligatorio";
    if (form.descripcion.trim().length < 10) return "La descripción debe tener al menos 10 caracteres";
    if (!form.ubicacion.trim()) return "La ubicación es obligatoria";
    if (form.categorias.length === 0) return "Selecciona al menos una categoría";
    return "";
  };

  const buildPayload = () => ({
    titulo: form.titulo.trim(),
    descripcion: form.descripcion.trim(),
    ubicacion: form.ubicacion.trim(),
    latitud: form.latitud ? parseFloat(form.latitud) : null,
    longitud: form.longitud ? parseFloat(form.longitud) : null,
    categorias: form.categorias,
  });

  return { form, updateField, setCategorias, validate, buildPayload, dirty, setDirty };
};

export default useAlojamientoForm;  