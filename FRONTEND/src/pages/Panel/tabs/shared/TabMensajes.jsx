import { useEffect, useRef, useState } from "react";
import { useOutletContext, useNavigate, useSearchParams } from "react-router-dom";
import useMensajesStore from "../../../stores/useMensajesStore";
import { Spinner, EmptyState } from "../../../components/common/ui/index";
import { ChatIcon, RefreshIcon } from "../../../components/common/icons/icons";

const tipoLabel = (tipo) => (tipo === "moderacion" ? "Moderación" : "Consulta");

const otherParticipant = (conv, userId) =>
  (conv?.participantes || []).find((p) => `${p.id}` !== `${userId}`);

const formatTime = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
};

/**
 * Inbox + hilo de chat para turista, anfitrión y admin.
 * Polling ligero cada 8s cuando hay conversación abierta.
 */
const TabMensajes = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const openId = searchParams.get("c");

  const conversaciones = useMensajesStore((s) => s.conversaciones);
  const activa = useMensajesStore((s) => s.activa);
  const loading = useMensajesStore((s) => s.loading);
  const error = useMensajesStore((s) => s.error);
  const fetchConversaciones = useMensajesStore((s) => s.fetchConversaciones);
  const openConversacion = useMensajesStore((s) => s.openConversacion);
  const sendMensaje = useMensajesStore((s) => s.sendMensaje);
  const clearActiva = useMensajesStore((s) => s.clearActiva);

  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchConversaciones().catch(() => {});
    return () => clearActiva();
  }, [fetchConversaciones, clearActiva]);

  useEffect(() => {
    if (openId) {
      openConversacion(openId).catch(() => {});
    }
  }, [openId, openConversacion]);

  useEffect(() => {
    if (!activa?.id) return undefined;
    const timer = setInterval(() => {
      openConversacion(activa.id).catch(() => {});
    }, 8000);
    return () => clearInterval(timer);
  }, [activa?.id, openConversacion]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activa?.mensajes?.length]);

  const selectConv = async (id) => {
    navigate(`/panel/mensajes?c=${id}`, { replace: true });
    await openConversacion(id);
  };

  const handleSend = async () => {
    if (!draft.trim()) return;
    setSending(true);
    setSendError("");
    try {
      await sendMensaje(draft.trim());
      setDraft("");
    } catch (e) {
      setSendError(e.message);
    } finally {
      setSending(false);
    }
  };

  const peer = otherParticipant(activa, user.id);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 className="display" style={{ fontSize: "1.35rem", margin: 0 }}>Mensajes</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "4px 0 0" }}>
            {user.rol === "admin"
              ? "Habla con anfitriones sobre aprobaciones y cambios."
              : user.rol === "anfitrion"
                ? "Responde a turistas y a moderación."
                : "Consulta con anfitriones antes de reservar."}
          </p>
        </div>
        <button className="btn btn-sm" onClick={() => fetchConversaciones()}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <RefreshIcon fontSize="small" /> Actualizar
          </span>
        </button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: "1rem" }}>{error}</div>}

      <div className="chat-layout">
        <aside className="chat-inbox">
          {loading && conversaciones.length === 0 ? (
            <Spinner />
          ) : conversaciones.length === 0 ? (
            <EmptyState icon={<ChatIcon fontSize="inherit" />} message="Aún no tienes conversaciones" />
          ) : (
            conversaciones.map((c) => {
              const other = otherParticipant(c, user.id);
              const active = `${activa?.id}` === `${c.id}`;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`chat-inbox-item ${active ? "active" : ""}`}
                  onClick={() => selectConv(c.id)}
                >
                  <div className="chat-inbox-top">
                    <strong>{other?.nombre || "Conversación"}</strong>
                    {c.no_leidos > 0 && <span className="badge badge-green">{c.no_leidos}</span>}
                  </div>
                  <div className="chat-inbox-meta">
                    <span className="badge badge-gray">{tipoLabel(c.tipo)}</span>
                    {c.alojamiento_titulo && <span>{c.alojamiento_titulo}</span>}
                  </div>
                  <p className="chat-inbox-preview">{c.ultimo_mensaje || "Sin mensajes"}</p>
                </button>
              );
            })
          )}
        </aside>

        <section className="chat-thread">
          {!activa ? (
            <div className="chat-thread-empty">
              <ChatIcon fontSize="large" />
              <p>Selecciona una conversación para ver los mensajes</p>
            </div>
          ) : (
            <>
              <header className="chat-thread-header">
                <div>
                  <strong>{peer?.nombre || "Chat"}</strong>
                  <div className="chat-inbox-meta">
                    <span className="badge badge-gray">{tipoLabel(activa.tipo)}</span>
                    {activa.alojamiento_titulo && <span>{activa.alojamiento_titulo}</span>}
                  </div>
                </div>
              </header>

              <div className="chat-messages">
                {(activa.mensajes || []).map((m) => {
                  const mine = `${m.id_remitente}` === `${user.id}`;
                  return (
                    <div key={m.id} className={`chat-bubble-wrap ${mine ? "mine" : "theirs"}`}>
                      <div className={`chat-bubble ${mine ? "mine" : "theirs"}`}>
                        {!mine && (
                          <div className="chat-bubble-author">{m.nombre_remitente}</div>
                        )}
                        <p>{m.cuerpo}</p>
                        <time>{formatTime(m.created_at)}</time>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {sendError && <div className="alert alert-error">{sendError}</div>}

              <div className="chat-composer">
                <textarea
                  className="form-input"
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button className="btn btn-primary" onClick={handleSend} disabled={sending || !draft.trim()}>
                  {sending ? "..." : "Enviar"}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default TabMensajes;
