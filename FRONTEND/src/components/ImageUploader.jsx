import { useMemo, useRef } from "react";
import { CloseIcon } from "./icons";

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

  const previewItems = useMemo(
    () => files.map((file) => ({ id: `${file.name}-${file.lastModified}`, url: URL.createObjectURL(file), name: file.name, type: "new" })),
    [files]
  );

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFiles = (selectedFiles) => {
    const nextFiles = Array.from(selectedFiles || []).filter((file) => file.type.startsWith("image/"));
    if (nextFiles.length === 0) return;
    onFilesChange?.([...files, ...nextFiles]);
  };

  const onDrop = (event) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
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
          onChange={(event) => handleFiles(event.target.files)}
          disabled={disabled}
        />
        <p className="dropzone-title">Arrastra y suelta o haz clic para agregar imágenes</p>
        <p className="dropzone-subtitle">JPG, PNG, WEBP. Puedes subir varias a la vez.</p>
        {loading && <div className="dropzone-loading">Subiendo imágenes...</div>}
      </div>

      {(existingImages.length > 0 || previewItems.length > 0) && (
        <div className="preview-grid">
          {existingImages.map((image) => (
            <div key={image.id ?? image.public_id ?? image.url} className="preview-card">
              <img src={image.url} alt={image.alt || "Imagen"} />
              <button type="button" className="preview-remove" onClick={() => onRemoveExisting?.(image)}>
                <CloseIcon fontSize="inherit" />
              </button>
            </div>
          ))}

          {previewItems.map((image, index) => (
            <div key={image.id} className="preview-card">
              <img src={image.url} alt={image.name} />
              <button type="button" className="preview-remove" onClick={() => onRemoveFile?.(index)}>
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
