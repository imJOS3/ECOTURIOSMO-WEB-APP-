// src/components/panels/AlojamientosGrid.jsx
import AlojamientoCard from "../Alojamiento/AlojamientoCard";
import { Badge, EmptyState } from "../common/ui/index";
import { HomeIcon } from "../common/icons/icons";

const AlojamientosGrid = ({ alojamientos, user, onView, onDelete }) => {
  if (alojamientos.length === 0) {
    return <EmptyState icon={<HomeIcon fontSize="inherit" />} message="Sin alojamientos" />;
  }

  const canManage = user.rol === "anfitrion" || user.rol === "admin";

  return (
    <div className="cards-grid">
      {alojamientos.map((a) => (
        <AlojamientoCard
          key={a.id}
          item={a}
          onClick={onView}
          actions={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Badge status={a.estado || a.estado_publicacion} />
              {canManage && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => { e.stopPropagation(); onDelete(a.id); }}
                >
                  Eliminar
                </button>
              )}
            </div>
          }
        />
      ))}
    </div>
  );
};

export default AlojamientosGrid;