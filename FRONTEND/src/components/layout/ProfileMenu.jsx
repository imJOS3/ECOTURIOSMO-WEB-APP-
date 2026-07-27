import { useEffect, useRef, useState } from "react";

/**
 * Menú desplegable del avatar: perfil, soporte y cerrar sesión.
 */
const ProfileMenu = ({ user, onConfigurarPerfil, onSoporte, onRequestLogout }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onDoc = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const go = (action) => {
    setOpen(false);
    action?.();
  };

  return (
    <div className="profile-menu" ref={rootRef}>
      <button
        type="button"
        className={`profile-menu-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        title="Perfil"
      >
        <span className="avatar profile-menu-avatar">
          {user?.nombre?.[0]?.toUpperCase() || "U"}
        </span>
        <span className="profile-menu-name">{user?.nombre?.split(" ")[0] || "Perfil"}</span>
        <span className="profile-menu-caret" aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div className="profile-menu-dropdown" role="menu">
          <div className="profile-menu-header">
            <strong>{user?.nombre}</strong>
            <span>{user?.email}</span>
            <em>{user?.rol}</em>
          </div>
          <button
            type="button"
            className="profile-menu-item"
            role="menuitem"
            onClick={() => go(onConfigurarPerfil)}
          >
            Configurar perfil
          </button>
          <button
            type="button"
            className="profile-menu-item"
            role="menuitem"
            onClick={() => go(onSoporte)}
          >
            Soporte y ayuda técnica
          </button>
          <div className="profile-menu-divider" />
          <button
            type="button"
            className="profile-menu-item danger"
            role="menuitem"
            onClick={() => go(onRequestLogout)}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
