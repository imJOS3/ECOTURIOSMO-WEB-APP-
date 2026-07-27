import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { useServiciosStore } from "../../../../stores/useServiciosStore";
import { Spinner, EmptyState } from "../../../../components/common/ui/index";
import { TagIcon } from "../../../../components/common/icons/icons";
import { AmenityIcon, AMENITY_ICON_OPTIONS } from "../../../../components/Alojamiento/amenityIcons";

const CrearServicio = ({ onCreated }) => {
  const createServicio = useServiciosStore((state) => state.createServicio);
  const [nombre, setNombre] = useState("");
  const [icono, setIcono] = useState("check");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    if (!nombre.trim()) return;
    try {
      await createServicio({ nombre: nombre.trim(), icono });
      setNombre("");
      setIcono("check");
      setMsg("¡Servicio creado!");
      onCreated();
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 180px auto",
        gap: 8,
        marginBottom: "1.5rem",
        alignItems: "end",
      }}
    >
      <div>
        <label className="form-label">Nuevo servicio</label>
        <input
          className="form-input"
          placeholder="Ej: Wifi, Jacuzzi, Estacionamiento..."
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
      </div>
      <div>
        <label className="form-label">Icono</label>
        <select
          className="form-input form-select"
          value={icono}
          onChange={(e) => setIcono(e.target.value)}
        >
          {AMENITY_ICON_OPTIONS.map((slug) => (
            <option key={slug} value={slug}>
              {slug}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary btn-sm" onClick={submit} style={{ height: 42 }}>
        Agregar
      </button>
      {msg && (
        <span style={{ fontSize: "0.8rem", color: msg.startsWith("¡") ? "var(--green)" : "var(--danger, #b00020)" }}>
          {msg}
        </span>
      )}
    </div>
  );
};

const TabServicios = () => {
  const { user } = useOutletContext();
  const items = useServiciosStore((state) => state.items);
  const loading = useServiciosStore((state) => state.loading);
  const fetchServicios = useServiciosStore((state) => state.fetchServicios);
  const updateServicio = useServiciosStore((state) => state.updateServicio);
  const removeServicio = useServiciosStore((state) => state.removeServicio);

  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editIcono, setEditIcono] = useState("check");

  const load = useCallback(async () => {
    setMsg("");
    try {
      await fetchServicios(true);
    } catch (e) {
      setMsg(e.message);
    }
  }, [fetchServicios]);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (servicio) => {
    setEditingId(servicio.id);
    setEditNombre(servicio.nombre);
    setEditIcono(servicio.icono || "check");
  };

  const saveEdit = async () => {
    try {
      await updateServicio(editingId, { nombre: editNombre.trim(), icono: editIcono });
      setEditingId(null);
      await load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("¿Eliminar este servicio del catálogo?")) return;
    try {
      await removeServicio(id);
      await load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  if (loading && items.length === 0) return <Spinner />;

  return (
    <div>
      {msg && <div className="alert alert-error">{msg}</div>}
      {user.rol === "admin" && <CrearServicio onCreated={load} />}

      {items.length === 0 ? (
        <EmptyState icon={<TagIcon fontSize="inherit" />} message="Sin servicios" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((servicio) => (
            <div
              key={servicio.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                border: "0.5px solid var(--border)",
                borderRadius: 10,
                background: "var(--card-bg)",
              }}
            >
              {editingId === servicio.id ? (
                <>
                  <AmenityIcon icono={editIcono} nombre={editNombre} size={20} />
                  <input
                    className="form-input"
                    style={{ flex: 1 }}
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                  />
                  <select
                    className="form-input form-select"
                    style={{ width: 160 }}
                    value={editIcono}
                    onChange={(e) => setEditIcono(e.target.value)}
                  >
                    {AMENITY_ICON_OPTIONS.map((slug) => (
                      <option key={slug} value={slug}>
                        {slug}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-primary btn-sm" onClick={saveEdit}>
                    Guardar
                  </button>
                  <button className="btn btn-sm" onClick={() => setEditingId(null)}>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <AmenityIcon icono={servicio.icono} nombre={servicio.nombre} size={20} />
                  <span style={{ flex: 1, fontWeight: 500 }}>{servicio.nombre}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{servicio.icono}</span>
                  {user.rol === "admin" && (
                    <>
                      <button className="btn btn-sm" onClick={() => startEdit(servicio)}>
                        Editar
                      </button>
                      <button className="btn btn-sm" onClick={() => handleRemove(servicio.id)}>
                        Eliminar
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TabServicios;
