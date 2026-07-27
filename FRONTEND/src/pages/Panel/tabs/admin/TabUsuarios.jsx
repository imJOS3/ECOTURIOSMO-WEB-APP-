import { useState, useEffect, useCallback } from "react";
import useUsuariosStore from "../../../../stores/useUsuariosStore";
import { Badge, Spinner, EmptyState } from "../../../../components/common/ui/index";
import { GroupIcon } from "../../../../components/common/icons/icons";

const TabUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setMsg("");
    try {
      await useUsuariosStore.getState().fetchUsuarios();
      setUsuarios(useUsuariosStore.getState().usuarios || []);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner />;

  return (
    <div>
      {msg && <div className="alert alert-error">{msg}</div>}
      {usuarios.length === 0 ? (
        <EmptyState icon={<GroupIcon fontSize="inherit" />} message="Sin usuarios" />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Registrado</th></tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: "var(--green-light)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: "0.75rem", color: "var(--green)", fontWeight: 600,
                      }}
                    >
                      {u.nombre?.[0]}
                    </div>
                    {u.nombre}
                  </td>
                  <td>{u.email}</td>
                  <td><Badge status={u.rol} /></td>
                  <td>{new Date(u.created_at).toLocaleDateString("es-CO")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TabUsuarios;