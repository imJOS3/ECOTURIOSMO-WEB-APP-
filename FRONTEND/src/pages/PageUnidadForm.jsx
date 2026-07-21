import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { CalendarIcon, BackIcon } from "../components/common/icons/icons";
import { useUnidadesStore } from "../stores/useUnidadesStore";

import { useInitialUnidad } from "../components/Unidad/form/useInitialUnidad";
import { useUnidadForm } from "../components/Unidad/form/useUnidadForm";
import { useImageGallery } from "../components/common/imageGallery/useImageGallery";
import UnidadInfoSection from "../components/Unidad/form/UnidadInfoSection";
import UnidadDetailsSection from "../components/Unidad/form/UnidadDetailsSection";
import UnidadCategoriesSection from "../components/Unidad/form/UnidadCategoriesSection";
import ImageGallerySection from "../components/common/imageGallery/ImageGallerySection";
import UnidadPreviewSidebar from "../components/Unidad/form/UnidadPreviewSidebar";

export const PageUnidadForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { alojamientoId, id: routeId } = useParams();

  const createUnidad = useUnidadesStore((state) => state.createUnidad);
  const updateUnidad = useUnidadesStore((state) => state.updateUnidad);

  const { initialData, isEdit, loading: loadingInitial, loadError } = useInitialUnidad({
    routeId,
    locationUnidad: location.state?.unidad,
  });

  const { form, updateField, setCategorias, validate, buildPayload, dirty: formDirty, setDirty: setFormDirty } =
    useUnidadForm(initialData);

  const gallery = useImageGallery({ entityType: "unidad", entityId: initialData?.id, isEdit });

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
      const payload = buildPayload(alojamientoId || initialData?.id_alojamiento);
      const saved = isEdit
        ? await updateUnidad(initialData.id, payload)
        : await createUnidad(payload);

      const unidadId = saved?.data?.id || saved?.id || initialData?.id;
      await gallery.commit(unidadId);

      setFormDirty(false);
      navigate(`/alojamientos/${alojamientoId || initialData?.id_alojamiento}/unidades/${unidadId}`, {
        state: { unidad: saved?.data || saved },
      });
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
        Cargando unidad...
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
          {isEdit ? "Editar unidad" : "Nueva unidad"}
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Categorías, imágenes y precio listos para una experiencia tipo Booking.
        </p>
      </div>

      <div className="alert alert-amber" style={{ marginBottom: "1.5rem" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <CalendarIcon fontSize="small" /> La unidad quedará en revisión hasta ser aprobada.
        </span>
      </div>

      {(error || loadError || gallery.error) && (
        <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
          {error || loadError || gallery.error}
        </div>
      )}

      <div className="detail-layout">
        <div>
          <UnidadInfoSection form={form} onChange={updateField} />
          <UnidadDetailsSection form={form} onChange={updateField} />
          <UnidadCategoriesSection value={form.categorias} onChange={setCategorias} />
          <ImageGallerySection
            gallery={gallery.gallery}
            coverKey={gallery.effectiveCoverKey}
            onAddFiles={gallery.addFiles}
            onRemove={gallery.removeImage}
            onSetCover={gallery.setCover}
            dragHandlers={gallery.dragHandlers}
          />
        </div>

        <UnidadPreviewSidebar
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

export default PageUnidadForm;