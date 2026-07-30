// Catálogo de imágenes: agregar, quitar, reordenar, portada y espacio.
import { useEffect, useRef, useState } from "react";
import { useImagenesStore } from "../../../stores/useImagenesStore";
import { DEFAULT_ESPACIO_FOTO } from "../../../constants/espaciosFoto";

const toGalleryItems = (images) =>
  (images || []).map((image, index) => ({
    key: `existing-${image.id ?? image.public_id ?? index}`,
    kind: "existing",
    id: image.id ?? image.public_id,
    url: image.url || image.secure_url || image.path,
    espacio: image.espacio || DEFAULT_ESPACIO_FOTO,
  }));

export const useImageGallery = ({ entityType = "alojamiento", entityId, isEdit }) => {
  const fetchImagenes = useImagenesStore((state) => state.fetchImagenes);
  const uploadImagenes = useImagenesStore((state) => state.uploadImagenes);
  const deleteImagen = useImagenesStore((state) => state.deleteImagen);
  const updateImagenEspacio = useImagenesStore((state) => state.updateImagenEspacio);
  const reorderImagenes = useImagenesStore((state) => state.reorderImagenes);
  const setImagenPrincipal = useImagenesStore((state) => state.setImagenPrincipal);

  const [gallery, setGallery] = useState([]);
  const [coverKey, setCoverKey] = useState(null);
  const [activeEspacio, setActiveEspacio] = useState(DEFAULT_ESPACIO_FOTO);
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

  const addFiles = (fileList, espacio = activeEspacio) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    const newItems = files.map((file, index) => ({
      key: `new-${Date.now()}-${index}-${file.name}`,
      kind: "new",
      file,
      url: URL.createObjectURL(file),
      espacio: espacio || DEFAULT_ESPACIO_FOTO,
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

  const setEspacio = async (item, espacio) => {
    setGallery((items) =>
      items.map((i) => (i.key === item.key ? { ...i, espacio } : i))
    );
    setDirty(true);

    if (item.kind === "existing" && entityId) {
      try {
        await updateImagenEspacio({
          entityType,
          entityId,
          imageId: item.id,
          espacio,
        });
      } catch (err) {
        setError(err.message || "No se pudo actualizar el espacio");
      }
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

  const commit = async (finalEntityId) => {
    const newItems = gallery.filter((item) => item.kind === "new");

    if (finalEntityId && newItems.length > 0) {
      setUploading(true);
      try {
        await uploadImagenes({
          entityType,
          id: finalEntityId,
          items: newItems.map((item) => ({
            file: item.file,
            espacio: item.espacio || DEFAULT_ESPACIO_FOTO,
          })),
        });
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
    activeEspacio,
    setActiveEspacio,
    uploading,
    dirty,
    error,
    addFiles,
    removeImage,
    setEspacio,
    setCover,
    dragHandlers,
    commit,
  };
};

export default useImageGallery;
