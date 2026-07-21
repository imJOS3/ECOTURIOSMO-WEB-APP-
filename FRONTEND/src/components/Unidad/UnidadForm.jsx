import { useEffect, useState } from "react";
import { CloseIcon } from "../common/icons/icons";
import CategoryPicker from "../Alojamiento/CategoryPicker";
import ImageUploader from "../common/ImageUploader";
import { useUnidadesStore } from "../../stores/useUnidadesStore";
import { useImagenesStore } from "../../stores/useImagenesStore";
import { baseUnidad, normalizeUnidadImages } from "../../utils/formHelpers";

export const UnidadForm = ({ alojamientoId, onClose, onCreated, initialData = null }) => {
  const isEdit = Boolean(initialData?.id);
  const createUnidad = useUnidadesStore((state) => state.createUnidad);
  const updateUnidad = useUnidadesStore((state) => state.updateUnidad);
  const fetchImagenes = useImagenesStore((state) => state.fetchImagenes);
  const uploadImagenes = useImagenesStore((state) => state.uploadImagenes);
  const deleteImagen = useImagenesStore((state) => state.deleteImagen);

  const [form, setForm] = useState(() => baseUnidad(initialData || {}));
  const [newFiles, setNewFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(normalizeUnidadImages(initialData));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isEdit || !initialData?.id) return;
    fetchImagenes({ entityType: "unidad", id: initialData.id })
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) {
          setExistingImages(items);
        }
      })
      .catch(() => {});
  }, [fetchImagenes, initialData?.id, isEdit]);

  const title = isEdit ? "Editar unidad" : "Nueva unidad";
  const submitLabel = isEdit ? "Guardar cambios" : "Crear unidad";

  const removeNewFile = (index) => {
    setNewFiles((files) => files.filter((_, fileIndex) => fileIndex !== index));
  };

  const removeExistingImage = async (image) => {
    if (!isEdit || !initialData?.id) {
      setExistingImages((images) => images.filter((item) => `${item.id ?? item.public_id}` !== `${image.id ?? image.public_id}`));
      return;
    }

    try {
      await deleteImagen({ entityType: "unidad", entityId: initialData.id, imageId: image.id ?? image.public_id });
      setExistingImages((images) => images.filter((item) => `${item.id ?? item.public_id}` !== `${image.id ?? image.public_id}`));
    } catch (uploadError) {
      setError(uploadError.message);
    }
  };

  const submit = async () => {
    if (!form.nombre.trim() || !form.precio_noche) {
      setError("Nombre y precio son obligatorios");
      return;
    }
    if (form.categorias.length === 0) {
      setError("Selecciona al menos una categoría");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        id_alojamiento: alojamientoId,
        nombre: form.nombre.trim(),
        tipo: form.tipo,
        descripcion: form.descripcion.trim(),
        capacidad: parseInt(form.capacidad, 10) || 1,
        cupos_disponibles: parseInt(form.cupos_disponibles, 10) || parseInt(form.capacidad, 10) || 1,
        precio_noche: parseFloat(form.precio_noche),
        es_compartido: Boolean(form.es_compartido),
        categorias: form.categorias,
      };

      const saved = isEdit
        ? await updateUnidad(initialData.id, payload)
        : await createUnidad(payload);

      const unidadId = saved?.data?.id || saved?.id || initialData?.id;

      if (unidadId && newFiles.length > 0) {
        setUploading(true);
        await uploadImagenes({ entityType: "unidad", id: unidadId, files: newFiles });
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
            <p className="modal-subtitle">Categorías, imágenes y precio listos para Booking-style UX.</p>
          </div>
          <button className="modal-close" onClick={onClose}><CloseIcon fontSize="inherit" /></button>
        </div>
        <div className="alert alert-amber">La unidad quedará en revisión hasta ser aprobada.</div>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input className="form-input" placeholder="Ej: Cabaña Principal" value={form.nombre} onChange={(event) => setForm((state) => ({ ...state, nombre: event.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select className="form-input form-select" value={form.tipo} onChange={(event) => setForm((state) => ({ ...state, tipo: event.target.value }))}>
              <option value="habitacion">Habitación</option>
              <option value="cabaña">Cabaña</option>
              <option value="glamping">Glamping</option>
              <option value="apartamento">Apartamento</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Capacidad (personas)</label>
            <input className="form-input" type="number" min={1} value={form.capacidad} onChange={(event) => setForm((state) => ({ ...state, capacidad: event.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Precio por noche</label>
            <input className="form-input" type="number" min={0} step="1000" placeholder="150000" value={form.precio_noche} onChange={(event) => setForm((state) => ({ ...state, precio_noche: event.target.value }))} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea className="form-input" rows={3} value={form.descripcion} onChange={(event) => setForm((state) => ({ ...state, descripcion: event.target.value }))} style={{ resize: "vertical" }} />
        </div>

        <div className="form-group">
          <label className="form-label">¿Compartido?</label>
          <select className="form-input form-select" value={String(form.es_compartido)} onChange={(event) => setForm((state) => ({ ...state, es_compartido: event.target.value === "true" }))}>
            <option value="false">No — privado</option>
            <option value="true">Sí — compartido</option>
          </select>
        </div>

        <CategoryPicker
          tipo="unidad"
          value={form.categorias}
          onChange={(next) => setForm((state) => ({ ...state, categorias: next }))}
          label="Categorías de la unidad"
          hint="Solo se muestran categorías tipo unidad"
        />

        <ImageUploader
          label="Imágenes de la unidad"
          files={newFiles}
          existingImages={existingImages}
          loading={uploading}
          onFilesChange={setNewFiles}
          onRemoveFile={removeNewFile}
          onRemoveExisting={removeExistingImage}
        />

        <button className="btn btn-primary" style={{ width: "100%" }} onClick={submit} disabled={saving || uploading}>
          {saving ? "Guardando..." : uploading ? "Subiendo imágenes..." : submitLabel}
        </button>
      </div>
    </div>
  );
};

export default UnidadForm;