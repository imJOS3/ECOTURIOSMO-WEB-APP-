import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { useCategoriasStore } from "../../../../stores/useCategoriasStore";
import { categoriasService } from "../../../../services/categorias.service";
import { Spinner, EmptyState } from "../../../../components/common/ui/index";
import { TagIcon } from "../../../../components/common/icons/icons";
import { AmenityIcon, AMENITY_ICON_OPTIONS } from "../../../../components/Alojamiento/amenityIcons";

const CrearCategoria = ({ onCreated }) => {
  const [nombre, setNombre] = useState("");
  const [icono, setIcono] = useState("check");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    if (!nombre.trim()) return;
    try {
      await categoriasService.create({ nombre, tipo: "alojamiento", icono });
      setNombre("");
      setIcono("check");
      setMsg("¡Categoría creada!");
      onCreated();
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 160px 180px auto",
        gap: 8,
        marginBottom: "1.5rem",
        alignItems: "end",
      }}
    >
      <div>
        <label className="form-label">Nueva categoría</label>
        <input
          className="form-input"
          placeholder="Ej: Senderismo, Avistamiento..."
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
      </div>
      <div>
        <label className="form-label">Tipo</label>
        <select className="form-input form-select" value="alojamiento" disabled>
          <option value="alojamiento">Alojamiento</option>
        </select>
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
      {msg && <span style={{ fontSize: "0.8rem", color: "var(--green)" }}>{msg}</span>}
    </div>
  );
};

const TabCategorias = () => {
  const { user } = useOutletContext();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editIcono, setEditIcono] = useState("check");

  const load = useCallback(async () => {
    setLoading(true);
    setMsg("");
    try {
      await useCategoriasStore.getState().fetchCategorias("todas", true);
      setCategorias(useCategoriasStore.getState().porTipo.todas.items || []);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveIcon = async (categoria) => {
    try {
      await categoriasService.update(categoria.id, {
        nombre: categoria.nombre,
        tipo: categoria.tipo || "alojamiento",
        icono: editIcono,
      });
      setEditingId(null);
      await load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {msg && <div className="alert alert-error">{msg}</div>}
      {user.rol === "admin" && <CrearCategoria onCreated={load} />}
      {categorias.length === 0 ? (
        <EmptyState icon={<TagIcon fontSize="inherit" />} message="Sin categorías" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {categorias.map((c) => (
            <div
              key={c.id}
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
              <AmenityIcon icono={c.icono} nombre={c.nombre} size={20} />
              <span style={{ flex: 1, fontWeight: 500 }}>
                {c.nombre}
                <span style={{ color: "var(--text-muted)", fontWeight: 400 }}> · {c.tipo}</span>
              </span>
              {editingId === c.id ? (
                <>
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
                  <button className="btn btn-primary btn-sm" onClick={() => saveIcon(c)}>
                    Guardar
                  </button>
                  <button className="btn btn-sm" onClick={() => setEditingId(null)}>
                    Cancelar
                  </button>
                </>
              ) : (
                user.rol === "admin" && (
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditIcono(c.icono || "check");
                    }}
                  >
                    Icono
                  </button>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TabCategorias;
