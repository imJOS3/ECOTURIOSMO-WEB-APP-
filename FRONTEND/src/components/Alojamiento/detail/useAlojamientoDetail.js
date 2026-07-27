import { useEffect, useState } from "react";
import { useAlojamientosStore } from "../../../stores/useAlojamientosStore";
import useResenasStore from "../../../stores/useResenasStore";
import { imagenesService } from "../../../services/imagenes.service";

/**
 * Hook de datos del detalle (SRP + DIP):
 * - carga reseñas, imágenes y similares
 * - no conoce UI ni mapeo de presentación
 */
export const useAlojamientoDetail = (alojamientoId) => {
  const [resenas, setResenas] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [similares, setSimilares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        await useResenasStore.getState().fetchByAlojamiento(alojamientoId);
        if (!cancelled) {
          setResenas(useResenasStore.getState().resenas || []);
        }
      } catch {
        if (!cancelled) setResenas([]);
      }

      try {
        const data = await imagenesService.fetchAlojamiento(alojamientoId);
        if (!cancelled) {
          setImagenes(Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []);
        }
      } catch {
        if (!cancelled) setImagenes([]);
      }

      try {
        await useAlojamientosStore.getState().fetchAlojamientos();
        if (!cancelled) {
          const all = useAlojamientosStore.getState().items || [];
          setSimilares(all.filter((a) => `${a.id}` !== `${alojamientoId}`).slice(0, 6));
        }
      } catch {
        if (!cancelled) setSimilares([]);
      }

      if (!cancelled) setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [alojamientoId]);

  const refreshResenas = async () => {
    const updated = await useResenasStore.getState().fetchByAlojamiento(alojamientoId);
    setResenas(updated || useResenasStore.getState().resenas || []);
    return updated;
  };

  const createResena = async ({ comentario, calificacion }) => {
    await useResenasStore.getState().createResena({
      alojamiento_id: alojamientoId,
      comentario,
      puntuacion: calificacion,
    });
    return refreshResenas();
  };

  return {
    resenas,
    imagenes,
    similares,
    loading,
    createResena,
    refreshResenas,
  };
};

export default useAlojamientoDetail;
