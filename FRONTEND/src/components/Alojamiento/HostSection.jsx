import {
  BadgeCheckIcon, ClockIcon, SearchIcon, ShieldIcon,
  CalendarOffIcon, MessageIcon, PinLocationIcon,
} from "./detailIcons";

/**
 * HostSection
 * "Conoce al anfitrión" + "Lo que debes saber" (política de cancelación,
 * reglas de la casa, seguridad). Datos vía props con fallback ya resuelto
 * por el padre (AlojamientoDetail) contra placeholderData.js — ver
 * docs/PENDING_BACKEND.md.
 *
 * `onMessageHost` es opcional: si no se pasa, el botón queda deshabilitado
 * con un tooltip explicando que la mensajería aún no está conectada.
 */
const HostSection = ({ host, rules, onMessageHost }) => {
  return (
    <div className="host-section">
      <h3 className="display" style={{ fontSize: "1.3rem", marginBottom: "1.25rem" }}>Conoce al anfitrión</h3>

      <div className="host-section-grid">
        {/* ── Card izquierda: avatar + stats ── */}
        <div>
          <div className="host-profile-card">
            <div className="host-profile-avatar-wrap">
              <div
                className="review-avatar host-profile-avatar"
                style={host.avatarUrl ? { backgroundImage: `url(${host.avatarUrl})`, backgroundSize: "cover" } : undefined}
              >
                {!host.avatarUrl && host.nombre[0]?.toUpperCase()}
              </div>
              {host.verificado && (
                <span className="host-verified-badge" title="Identidad verificada">
                  <BadgeCheckIcon size={16} />
                </span>
              )}
            </div>
            <p className="host-profile-name">{host.nombre}</p>
            {host.esSuperanfitrion && (
              <p className="host-profile-tag">
                <BadgeCheckIcon size={12} /> Superanfitrión
              </p>
            )}

            <div className="host-stats-row">
              <div className="host-stat">
                <span className="host-stat-num">{host.numResenas}</span>
                <span className="host-stat-label">Reseñas</span>
              </div>
              <div className="host-stat">
                <span className="host-stat-num">{host.calificacion}★</span>
                <span className="host-stat-label">Calificación</span>
              </div>
              <div className="host-stat">
                <span className="host-stat-num">{host.aniosAnfitrionando}</span>
                <span className="host-stat-label">Años anfitrionando</span>
              </div>
            </div>
          </div>

          <div className="host-meta-line">
            <ClockIcon size={16} />
            <span>Dedico mucho tiempo a: {host.ocupacion}</span>
          </div>
          <div className="host-meta-line">
            <PinLocationIcon size={16} />
            <span>Vive en {host.ciudad}, {host.pais}</span>
          </div>
        </div>

        {/* ── Columna derecha: superanfitrión + respuesta + mensaje ── */}
        <div>
          {host.esSuperanfitrion && (
            <>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>{host.nombre} es Superanfitrión</p>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                Los Superanfitriones tienen mucha experiencia, mantienen valoraciones excelentes
                y se esfuerzan al máximo para ofrecer estadías memorables.
              </p>
            </>
          )}

          <p style={{ fontWeight: 600, marginBottom: 6 }}>Información sobre el anfitrión</p>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: 2 }}>
            Índice de respuesta: {host.indiceRespuesta}%
          </p>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            Responde en {host.tiempoRespuesta}
          </p>

          <button
            className="btn"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            onClick={onMessageHost}
            disabled={!onMessageHost}
            title={onMessageHost ? undefined : "La mensajería con anfitriones aún no está disponible"}
          >
            <MessageIcon size={16} /> Mensajea con el anfitrión
          </button>

          <div className="host-safety-note">
            <ShieldIcon size={18} />
            <span>Para proteger tu pago, realiza siempre la reserva y el contacto con el anfitrión dentro de la plataforma.</span>
          </div>
        </div>
      </div>

      {/* ── Lo que debes saber ── */}
      {rules && (
        <div className="know-section">
          <h3 className="display" style={{ fontSize: "1.2rem", marginBottom: "1.25rem" }}>Lo que debes saber</h3>
          <div className="know-grid">
            <div className="know-item">
              <CalendarOffIcon size={20} />
              <p className="know-item-title">Política de cancelación</p>
              <p className="know-item-desc">{rules.cancelacion.descripcion}</p>
            </div>
            <div className="know-item">
              <SearchIcon size={20} />
              <p className="know-item-title">Reglas de la casa</p>
              <ul className="know-item-list">
                {rules.reglas.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>
            <div className="know-item">
              <ShieldIcon size={20} />
              <p className="know-item-title">Seguridad y propiedad</p>
              <ul className="know-item-list">
                {rules.seguridad.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostSection;