// src/components/Unidad/form/useInitialUnidad.js

import { useEffect, useState } from "react";
import { useUnidadesStore } from "../../../stores/useUnidadesStore";

export const useInitialUnidad = ({ routeId, locationUnidad }) => {
  const fetchUnidad = useUnidadesStore((state) => state.fetchUnidad);
  const storeItems = useUnidadesStore((state) => state.items);

  const [initialData, setInitialData] = useState(locationUnidad || null);
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

    if (typeof fetchUnidad !== "function") {
      setLoading(false);
      return;
    }

    fetchUnidad(routeId)
      .then((data) => setInitialData(data?.data || data))
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, [routeId, initialData, storeItems, fetchUnidad]);

  return { initialData, isEdit, loading, loadError };
};

export default useInitialUnidad;