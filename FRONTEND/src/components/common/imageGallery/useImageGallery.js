// src/components/alojamientos/form/useImageGallery.js
//
// Única responsabilidad: el catálogo de imágenes (agregar, quitar, reordenar,
// elegir portada) y cómo se persiste al guardar (subir nuevas, reordenar,
// marcar portada). No sabe nada de los demás campos del formulario.
import { useEffect, useRef, useState } from "react";
import { useImagenesStore } from "../../../stores/useImagenesStore";

const toGalleryItems = (images) =>
  (images || []).map((image, index) => ({
    key: `existing-${image.id ?? image.public_id ?? index}`,
    kind: "existing",
    id: image.id ?? image.public_id,
    url: image.url || image.secure_url || image.path,
  }));

export const useImageGallery = ({ entityType = "alojamiento", entityId, isEdit }) => {
  const fetchImagenes = useImagenesStore((state) => state.fetchImagenes);
  const uploadImagenes = useImagenesStore((state) => state.uploadImagenes);
  const deleteImagen = useImagenesStore((state) => state.deleteImagen);
  const reorderImagenes = useImagenesStore((state) => state.reorderImagenes); // opcional, puede no existir
  const setImagenPrincipal = useImagenesStore((state) => state.setImagenPrincipal); // opcional

  const [gallery, setGallery] = useState([]);
  const [coverKey, setCoverKey] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const dragIndexRef = useRef(null);

  useEffect(() => {
    if (!isEdit || !entityId) return;
    fetchImagenes({ entityType, id: entityId })
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) setGallery(toGalleryItems(items));
      })
      .catch(() => {});
  }, [fetchImagenes, entityType, entityId, isEdit]);

  useEffect(() => {
    return () => {
      gallery.forEach((item) => {
        if (item.kind === "new" && item.url) URL.revokeObjectURL(item.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const effectiveCoverKey = coverKey || gallery[0]?.key || null;

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    const newItems = files.map((file, index) => ({
      key: `new-${Date.now()}-${index}-${file.name}`,
      kind: "new",
      file,
      url: URL.createObjectURL(file),
    }));
    setGallery((items) => [...items, ...newItems]);
    setDirty(true);
  };

  const removeImage = async (item) => {
    if (item.kind === "new") {
      URL.revokeObjectURL(item.url);
      setGallery((items) => items.filter((i) => i.key !== item.key));
      setDirty(true);
      return;
    }
    if (!isEdit || !entityId) {
      setGallery((items) => items.filter((i) => i.key !== item.key));
      return;
    }
    try {
      await deleteImagen({ entityType, entityId, imageId: item.id });
      setGallery((items) => items.filter((i) => i.key !== item.key));
      setDirty(true);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const setCover = (item) => {
    setCoverKey(item.key);
    setGallery((items) => [item, ...items.filter((i) => i.key !== item.key)]);
    setDirty(true);
  };

  const dragHandlers = {
    onDragStart: (index) => () => {
      dragIndexRef.current = index;
    },
    onDragOver: (index) => (event) => {
      event.preventDefault();
      const fromIndex = dragIndexRef.current;
      if (fromIndex === null || fromIndex === index) return;
      setGallery((items) => {
        const next = [...items];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(index, 0, moved);
        return next;
      });
      dragIndexRef.current = index;
      setDirty(true);
    },
    onDragEnd: () => {
      dragIndexRef.current = null;
    },
  };

  // Sube las imágenes nuevas y, si el store lo soporta, persiste orden/portada.
  // Los métodos opcionales se llaman solo si existen, así este hook funciona
  // igual aunque el backend todavía no tenga esos endpoints.
  const commit = async (finalEntityId) => {
    const newFiles = gallery.filter((item) => item.kind === "new").map((item) => item.file);

    if (finalEntityId && newFiles.length > 0) {
      setUploading(true);
      try {
        await uploadImagenes({ entityType, id: finalEntityId, files: newFiles });
      } finally {
        setUploading(false);
      }
    }

    if (finalEntityId && typeof reorderImagenes === "function") {
      const orderedIds = gallery.filter((item) => item.kind === "existing").map((item) => item.id);
      if (orderedIds.length > 0) {
        reorderImagenes({ entityType, id: finalEntityId, order: orderedIds }).catch(() => {});
      }
    }

    if (finalEntityId && effectiveCoverKey && typeof setImagenPrincipal === "function") {
      const coverItem = gallery.find((item) => item.key === effectiveCoverKey);
      if (coverItem?.kind === "existing") {
        setImagenPrincipal({ entityType, id: finalEntityId, imageId: coverItem.id }).catch(() => {});
      }
    }

    setDirty(false);
  };

  return {
    gallery,
    effectiveCoverKey,
    uploading,
    dirty,
    error,
    addFiles,
    removeImage,
    setCover,
    dragHandlers,
    commit,
  };
};

export default useImageGallery;