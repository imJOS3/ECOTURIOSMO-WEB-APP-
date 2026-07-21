// src/components/alojamientos/form/useInitialAlojamiento.js
//
// Única responsabilidad: obtener el alojamiento a editar (si aplica) y su
// estado de carga. No sabe nada del formulario ni de imágenes.
import { useEffect, useState } from "react";
import { useAlojamientosStore } from "../../../stores/useAlojamientosStore";

export const useInitialAlojamiento = ({ routeId, initialDataProp, locationAlojamiento }) => {
  const fetchAlojamiento = useAlojamientosStore((state) => state.fetchAlojamiento);
  const storeItems = useAlojamientosStore((state) => state.items);

  const [initialData, setInitialData] = useState(initialDataProp || locationAlojamiento || null);
  const isEdit = Boolean(routeId || initialData?.id);
  const [loading, setLoading] = useState(isEdit && !initialData);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!routeId || initialData) return;

    const fromStore = storeItems?.find?.((item) => `${item.id}` === `${routeId}`);
    if (fromStore) {
      setInitialData(fromStore);
      setLoading(false);
      return;
    }

    if (typeof fetchAlojamiento !== "function") {
      setLoading(false);
      return;
    }

    fetchAlojamiento(routeId)
      .then((data) => setInitialData(data?.data || data))
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, [routeId, initialData, storeItems, fetchAlojamiento]);

  return { initialData, isEdit, loading, loadError };
};

export default useInitialAlojamiento;