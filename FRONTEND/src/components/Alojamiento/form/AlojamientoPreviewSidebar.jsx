// src/components/alojamientos/form/AlojamientoPreviewSidebar.jsx
import AlojamientoCard from "../AlojamientoCard";
import { Badge } from "../../common/ui/index";
import { RefreshIcon } from "../../common/icons/icons";

export const AlojamientoPreviewSidebar = ({ previewItem, estado, saving, uploading, isEdit, onSubmit, onCancel }) => (
  <div className="detail-sidebar">
    <div className="sidebar-card">
      <p className="sidebar-card-title">Vista previa</p>
      <AlojamientoCard item={previewItem} onClick={() => {}} />
    </div>

    <div className="sidebar-card">
      <p className="sidebar-card-title">Estado</p>
      <Badge status={estado || "borrador"} />
      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <RefreshIcon fontSize="small" /> Después de aprobarse, podrás agregar unidades con su precio por noche.
        </span>
      </p>
    </div>

    <div className="sidebar-card" style={{ position: "sticky", top: "1rem" }}>
      <button className="btn btn-primary" style={{ width: "100%" }} onClick={onSubmit} disabled={saving || uploading}>
        {saving ? "Guardando..." : uploading ? "Subiendo imágenes..." : isEdit ? "Guardar cambios" : "Crear alojamiento"}
      </button>
      <button className="btn btn-sm" style={{ width: "100%", marginTop: "0.5rem" }} onClick={onCancel} disabled={saving || uploading}>
        Cancelar
      </button>
    </div>
  </div>
);

export default AlojamientoPreviewSidebar;