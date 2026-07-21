import UnidadCard from "../UnidadCard";
import { Badge } from "../../common/ui";

export const UnidadPreviewSidebar = ({ previewItem, estado, saving, uploading, isEdit, onSubmit, onCancel }) => (
  <div className="detail-sidebar">
    <div className="sidebar-card">
      <p className="sidebar-card-title">Vista previa</p>
      <UnidadCard item={previewItem} onClick={() => {}} />
    </div>

    <div className="sidebar-card">
      <p className="sidebar-card-title">Estado</p>
      <Badge status={estado || "borrador"} />
      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
        La unidad quedará en revisión hasta ser aprobada por un admin.
      </p>
    </div>

    <div className="sidebar-card" style={{ position: "sticky", top: "1rem" }}>
      <button className="btn btn-primary" style={{ width: "100%" }} onClick={onSubmit} disabled={saving || uploading}>
        {saving ? "Guardando..." : uploading ? "Subiendo imágenes..." : isEdit ? "Guardar cambios" : "Crear unidad"}
      </button>
      <button className="btn btn-sm" style={{ width: "100%", marginTop: "0.5rem" }} onClick={onCancel} disabled={saving || uploading}>
        Cancelar
      </button>
    </div>
  </div>
);

export default UnidadPreviewSidebar;