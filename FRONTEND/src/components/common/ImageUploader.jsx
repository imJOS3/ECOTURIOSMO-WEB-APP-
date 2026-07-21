import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "./icons/icons";

const MAX_SIZE_MB = 5;
const MAX_FILES = 10;

const ImageUploader = ({
  label = "Imágenes",
  hint = "Sube varias imágenes. Puedes ordenar y eliminar antes de guardar.",
  files = [],
  existingImages = [],
  onFilesChange,
  onRemoveFile,
  onRemoveExisting,
  loading = false,
  disabled = false,
}) => {
  const inputRef = useRef(null);
  const [previewItems, setPreviewItems] = useState([]);
  const [error, setError] = useState(null);

  // Crea las object URLs para preview y las libera cuando `files` cambia o
  // el componente se desmonta, evitando el memory leak de createObjectURL.
  useEffect(() => {
    const items = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${file.size}`,
      url: URL.createObjectURL(file),
      name: file.name,
      type: "new",
    }));

    setPreviewItems(items);

    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [files]);

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFiles = (selectedFiles) => {
    setError(null);

    const incoming = Array.from(selectedFiles || []);
    if (incoming.length === 0) return;

    const rejected = [];
    const validFiles = incoming.filter((file) => {
      if (!file.type.startsWith("image/")) {
        rejected.push(`${file.name} (formato no soportado)`);
        return false;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        rejected.push(`${file.name} (supera ${MAX_SIZE_MB}MB)`);
        return false;
      }
      return true;
    });

    const total = files.length + existingImages.length + validFiles.length;
    let finalFiles = validFiles;

    if (total > MAX_FILES) {
      const allowedCount = Math.max(
        0,
        MAX_FILES - files.length - existingImages.length
      );
      finalFiles = validFiles.slice(0, allowedCount);
      if (validFiles.length > allowedCount) {
        rejected.push(`Se descartaron algunas imágenes (máximo ${MAX_FILES})`);
      }
    }

    if (rejected.length > 0) {
      setError(`No se agregaron: ${rejected.join(", ")}`);
    }

    if (finalFiles.length === 0) return;

    onFilesChange?.([...files, ...finalFiles]);
  };

  const onInputChange = (event) => {
    handleFiles(event.target.files);
    // Reset para permitir volver a seleccionar el mismo archivo
    event.target.value = "";
  };

  const onDrop = (event) => {
    event.preventDefault();
    if (disabled) return;
    handleFiles(event.dataTransfer.files);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  };

  return (
    <div className="form-group">
      <div className="form-label-row">
        <label className="form-label">{label}</label>
        <span className="form-hint">{hint}</span>
      </div>

      <div
        className={`dropzone ${disabled ? "disabled" : ""}`}
        onClick={openPicker}
        onKeyDown={onKeyDown}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={onInputChange}
          disabled={disabled}
        />
        <p className="dropzone-title">Arrastra y suelta o haz clic para agregar imágenes</p>
        <p className="dropzone-subtitle">
          JPG, PNG, WEBP. Máx {MAX_SIZE_MB}MB por imagen, hasta {MAX_FILES} imágenes.
        </p>
        {loading && <div className="dropzone-loading">Subiendo imágenes...</div>}
      </div>

      {error && <p className="form-error">{error}</p>}

      {(existingImages.length > 0 || previewItems.length > 0) && (
        <div className="preview-grid">
          {existingImages.map((image) => (
            <div key={image.id ?? image.public_id ?? image.url} className="preview-card">
              <img src={image.url} alt={image.alt || "Imagen"} />
              <button
                type="button"
                className="preview-remove"
                onClick={() => onRemoveExisting?.(image)}
                aria-label="Eliminar imagen"
              >
                <CloseIcon fontSize="inherit" />
              </button>
            </div>
          ))}

          {previewItems.map((image, index) => (
            <div key={image.id} className="preview-card">
              <img src={image.url} alt={image.name} />
              <button
                type="button"
                className="preview-remove"
                onClick={() => onRemoveFile?.(index)}
                aria-label="Eliminar imagen"
              >
                <CloseIcon fontSize="inherit" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;