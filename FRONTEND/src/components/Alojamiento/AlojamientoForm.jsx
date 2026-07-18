import { useEffect, useMemo, useState } from "react";
import { CloseIcon, RefreshIcon, CalendarIcon } from "../icons";
import CategoryPicker from "../CategoryPicker";
import ImageUploader from "../ImageUploader";
import { useAlojamientosStore } from "../../stores/useAlojamientosStore";
import { useImagenesStore } from "../../stores/useImagenesStore";
import { baseAlojamiento, normalizeAlojamientoImages } from "../../utils/formHelpers";

export const AlojamientoForm = ({ onClose, onCreated, initialData = null }) => {
  const isEdit = Boolean(initialData?.id);
  const createAlojamiento = useAlojamientosStore((state) => state.createAlojamiento);
  const updateAlojamiento = useAlojamientosStore((state) => state.updateAlojamiento);
  const fetchImagenes = useImagenesStore((state) => state.fetchImagenes);
  const uploadImagenes = useImagenesStore((state) => state.uploadImagenes);
  const deleteImagen = useImagenesStore((state) => state.deleteImagen);

  const [form, setForm] = useState(() => baseAlojamiento(initialData || {}));
  const [newFiles, setNewFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(normalizeAlojamientoImages(initialData));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isEdit || !initialData?.id) return;
    fetchImagenes({ entityType: "alojamiento", id: initialData.id })
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) {
          setExistingImages(items);
        }
      })
      .catch(() => {});
  }, [fetchImagenes, initialData?.id, isEdit]);

  const title = isEdit ? "Editar alojamiento" : "Nuevo alojamiento";
  const submitLabel = isEdit ? "Guardar cambios" : "Crear alojamiento";

  const selectedCategories = useMemo(() => form.categorias, [form.categorias]);

  const removeNewFile = (index) => {
    setNewFiles((files) => files.filter((_, fileIndex) => fileIndex !== index));
  };

  const removeExistingImage = async (image) => {
    if (!isEdit || !initialData?.id) {
      setExistingImages((images) => images.filter((item) => `${item.id ?? item.public_id}` !== `${image.id ?? image.public_id}`));
      return;
    }

    try {
      await deleteImagen({ entityType: "alojamiento", entityId: initialData.id, imageId: image.id ?? image.public_id });
      setExistingImages((images) => images.filter((item) => `${item.id ?? item.public_id}` !== `${image.id ?? image.public_id}`));
    } catch (uploadError) {
      setError(uploadError.message);
    }
  };

  const submit = async () => {
    if (!form.titulo.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (form.descripcion.trim().length < 10) {
      setError("La descripción debe tener al menos 10 caracteres");
      return;
    }
    if (!form.ubicacion.trim()) {
      setError("La ubicación es obligatoria");
      return;
    }
    if (selectedCategories.length === 0) {
      setError("Selecciona al menos una categoría");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        ubicacion: form.ubicacion.trim(),
        latitud: form.latitud ? parseFloat(form.latitud) : null,
        longitud: form.longitud ? parseFloat(form.longitud) : null,
        categorias: selectedCategories,
      };

      const saved = isEdit
        ? await updateAlojamiento(initialData.id, payload)
        : await createAlojamiento(payload);

      const alojamientoId = saved?.data?.id || saved?.id || initialData?.id;

      if (alojamientoId && newFiles.length > 0) {
        setUploading(true);
        await uploadImagenes({ entityType: "alojamiento", id: alojamientoId, files: newFiles });
        setUploading(false);
      }

      onCreated?.(saved);
    } catch (requestError) {
      setError(requestError.message);
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title display">{title}</h2>
            <p className="modal-subtitle">Diseño tipo Airbnb para categorías, imágenes y ubicación.</p>
          </div>
          <button className="modal-close" onClick={onClose}><CloseIcon fontSize="inherit" /></button>
        </div>
        <div className="alert alert-amber">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><CalendarIcon fontSize="small" /> El alojamiento quedará en revisión hasta que un admin lo apruebe. El precio se configura en cada unidad.</span>
        </div>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Título *</label>
            <input className="form-input" placeholder="Ej: Cabaña Bosque Nublado" value={form.titulo} onChange={(event) => setForm((state) => ({ ...state, titulo: event.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Ubicación *</label>
            <input className="form-input" placeholder="Ej: Sierra Nevada, Colombia" value={form.ubicacion} onChange={(event) => setForm((state) => ({ ...state, ubicacion: event.target.value }))} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Descripción * (mín. 10 caracteres)</label>
          <textarea className="form-input" rows={4} placeholder="Describe el alojamiento..." value={form.descripcion} onChange={(event) => setForm((state) => ({ ...state, descripcion: event.target.value }))} style={{ resize: "vertical" }} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Latitud (opcional)</label>
            <input className="form-input" type="number" step="any" placeholder="4.711" value={form.latitud} onChange={(event) => setForm((state) => ({ ...state, latitud: event.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Longitud (opcional)</label>
            <input className="form-input" type="number" step="any" placeholder="-74.072" value={form.longitud} onChange={(event) => setForm((state) => ({ ...state, longitud: event.target.value }))} />
          </div>
        </div>

        <CategoryPicker
          tipo="alojamiento"
          value={form.categorias}
          onChange={(next) => setForm((state) => ({ ...state, categorias: next }))}
          label="Categorías del alojamiento"
          hint="Solo se muestran categorías tipo alojamiento"
        />

        <ImageUploader
          label="Imágenes del alojamiento"
          files={newFiles}
          existingImages={existingImages}
          loading={uploading}
          onFilesChange={setNewFiles}
          onRemoveFile={removeNewFile}
          onRemoveExisting={removeExistingImage}
        />

        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><RefreshIcon fontSize="small" /> Después de aprobarse, podrás agregar unidades con su precio por noche.</span>
        </p>

        <button className="btn btn-primary" style={{ width: "100%" }} onClick={submit} disabled={saving || uploading}>
          {saving ? "Guardando..." : uploading ? "Subiendo imágenes..." : submitLabel}
        </button>
      </div>
    </div>
  );
};

export default AlojamientoForm;