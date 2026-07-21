// src/pages/PageAlojamientoForm.jsx
//

import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { BackIcon, CalendarIcon } from "../components/common/icons/icons";
import { useAlojamientosStore } from "../stores/useAlojamientosStore";

import { useInitialAlojamiento } from "../components/Alojamiento/form/useInitialAlojamiento";
import { useAlojamientoForm } from "../components/Alojamiento/form/useAlojamientoForm";
import { useImageGallery } from "../components/common/imageGallery/useImageGallery";
import AlojamientoInfoSection from "../components/Alojamiento/form/AlojamientoInfoSection";
import AlojamientoLocationSection from "../components/Alojamiento/form/AlojamientoLocationSection";
import AlojamientoCategoriesSection from "../components/Alojamiento/form/AlojamientoCategoriesSection";
import ImageGallerySection from "../components/common/imageGallery/ImageGallerySection";
import AlojamientoPreviewSidebar from "../components/Alojamiento/form/AlojamientoPreviewSidebar";

export const PageAlojamientoForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeId } = useParams();

  const createAlojamiento = useAlojamientosStore((state) => state.createAlojamiento);
  const updateAlojamiento = useAlojamientosStore((state) => state.updateAlojamiento);

  const { initialData, isEdit, loading: loadingInitial, loadError } = useInitialAlojamiento({
    routeId,
    locationAlojamiento: location.state?.alojamiento,
  });

  const { form, updateField, setCategorias, validate, buildPayload, dirty: formDirty, setDirty: setFormDirty } =
    useAlojamientoForm(initialData);

  const gallery = useImageGallery({ entityType: "alojamiento", entityId: initialData?.id, isEdit });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const dirty = formDirty || gallery.dirty;

  const submit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = buildPayload();
      const saved = isEdit
        ? await updateAlojamiento(initialData.id, payload)
        : await createAlojamiento(payload);

      const alojamientoId = saved?.data?.id || saved?.id || initialData?.id;
      await gallery.commit(alojamientoId);

      setFormDirty(false);
      navigate(`/alojamientos/${alojamientoId}`, { state: { alojamiento: saved?.data || saved } });
    } catch (requestError) {
      setError(requestError.message);
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (dirty && !window.confirm("Tienes cambios sin guardar. ¿Salir de todas formas?")) return;
    navigate(-1);
  };

  if (loadingInitial) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
        Cargando alojamiento...
      </div>
    );
  }

  const previewItem = {
    ...form,
    id: initialData?.id || "preview",
    imagenes: gallery.gallery.map((item) => ({ url: item.url })),
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>
      <button className="btn btn-sm" onClick={handleCancel} style={{ marginBottom: "1.5rem" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <BackIcon fontSize="small" /> Volver
        </span>
      </button>

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="display" style={{ fontSize: "2rem", marginBottom: "0.35rem" }}>
          {isEdit ? "Editar alojamiento" : "Nuevo alojamiento"}
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          {isEdit
            ? "Actualiza la información, categorías y fotos de tu alojamiento."
            : "Completa la información de tu alojamiento. Podrás agregar unidades una vez sea aprobado."}
        </p>
      </div>

      <div className="alert alert-amber" style={{ marginBottom: "1.5rem" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <CalendarIcon fontSize="small" /> El alojamiento quedará en revisión hasta que un admin lo apruebe.
          El precio se configura por unidad, no aquí.
        </span>
      </div>

      {(error || loadError || gallery.error) && (
        <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
          {error || loadError || gallery.error}
        </div>
      )}

      <div className="detail-layout">
        <div>
          <AlojamientoInfoSection form={form} onChange={updateField} />
          <AlojamientoLocationSection form={form} onChange={updateField} />
          <AlojamientoCategoriesSection value={form.categorias} onChange={setCategorias} />
          <ImageGallerySection
            gallery={gallery.gallery}
            coverKey={gallery.effectiveCoverKey}
            onAddFiles={gallery.addFiles}
            onRemove={gallery.removeImage}
            onSetCover={gallery.setCover}
            dragHandlers={gallery.dragHandlers}
          />
        </div>

        <AlojamientoPreviewSidebar
          previewItem={previewItem}
          estado={initialData?.estado || initialData?.estado_publicacion}
          saving={saving}
          uploading={gallery.uploading}
          isEdit={isEdit}
          onSubmit={submit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default PageAlojamientoForm;