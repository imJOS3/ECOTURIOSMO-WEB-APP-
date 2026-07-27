  import { apiFetch, apiUpload } from "../utils/api";

  // Sube varios archivos en paralelo, uno por request, respetando el
  // contrato actual del backend: campo "imagen" (singular) + el id de
  // la entidad dueña en el body (requerido por el schema de validación).
  const uploadImages = async (path, files, ownerField, ownerId) => {
    return Promise.all(
      files.map((file) => {
        const formData = new FormData();
        formData.append("imagen", file);
        formData.append(ownerField, ownerId);
        return apiUpload(path, formData);
      })
    );
  };
  
  

  export const imagenesService = {
    // =========================
    // FETCH
    // =========================
    fetchAlojamiento: (id) =>
      apiFetch(`/alojamiento-imagen/alojamiento/${id}`),


    // =========================
    // UPLOAD
    // =========================
    uploadAlojamiento: (id, files) =>
      uploadImages("/alojamiento-imagen", files, "id_alojamiento", id),


    // =========================
    // DELETE
    // =========================
    deleteAlojamiento: (idAlojamiento, imageId) =>
      apiFetch(`/alojamiento-imagen/${imageId}`, { method: "DELETE" }),
  };