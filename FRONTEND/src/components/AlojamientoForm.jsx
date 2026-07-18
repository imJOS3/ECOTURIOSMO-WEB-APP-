import { useEffect, useMemo, useState } from "react";
import { CloseIcon, RefreshIcon, CalendarIcon } from "./icons";
import CategoryPicker from "./CategoryPicker";
import ImageUploader from "./ImageUploader";
import { useAlojamientosStore } from "../stores/useAlojamientosStore";
import { useUnidadesStore } from "../stores/useUnidadesStore";
import { useImagenesStore } from "../stores/useImagenesStore";
import { normalizeImages } from "../utils/media";

const toCategoryIds = (value) => (Array.isArray(value) ? value.map((categoria) => Number(categoria?.id ?? categoria)).filter(Boolean) : []);

const toImageList = (value) => normalizeImages({ imagenes: value });

const baseAlojamiento = (data = {}) => ({
  titulo: data.titulo || "",
  descripcion: data.descripcion || "",
  ubicacion: data.ubicacion || "",
  latitud: data.latitud ?? "",
  longitud: data.longitud ?? "",
  categorias: toCategoryIds(data.categorias || []),
});

const baseUnidad = (data = {}) => ({
  nombre: data.nombre || "",
  tipo: data.tipo || "habitacion",
  descripcion: data.descripcion || "",
  capacidad: data.capacidad || 1,
  es_compartido: Boolean(data.es_compartido),
  precio_noche: data.precio_noche ?? "",
  cupos_disponibles: data.cupos_disponibles || data.capacidad || 1,
  categorias: toCategoryIds(data.categorias || []),
});

const normalizeAlojamientoImages = (data) => {
  if (!data) return [];
  return toImageList(data.imagenes || data.images || data.gallery || []);
};

const normalizeUnidadImages = (data) => {
  if (!data) return [];
  return toImageList(data.imagenes || data.images || data.gallery || []);
};

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

      const alojamientoId = saved?.id || initialData?.id;

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