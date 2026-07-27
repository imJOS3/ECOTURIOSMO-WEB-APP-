import { useEffect, useRef, useState } from "react";
import useMensajesStore from "../../stores/useMensajesStore";
import { CloseIcon, ChatIcon, RefreshIcon, BackIcon } from "../common/icons/icons";
import { Spinner, EmptyState } from "../common/ui/index";
import {
  tipoLabel,
  otherParticipant,
  formatChatTime,
  formatUnreadBadge,
} from "./chatHelpers";

/**
 * Ventana flotante fija (tipo Messenger de Facebook):
 * no es menú ni drawer a pantalla completa.
 */
const MessagesDrawer = ({ user, open, onClose }) => {
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
    if (!open) return undefined;
    fetchConversaciones().catch(() => {});
    const timer = setInterval(() => {
      fetchConversaciones({ silent: true }).catch(() => {});
      const id = useMensajesStore.getState().activa?.id;
      if (id) openConversacion(id).catch(() => {});
    }, 8000);
    return () => clearInterval(timer);
  }, [open, fetchConversaciones, openConversacion]);

  useEffect(() => {
    if (!open) {
      setDraft("");
      setSendError("");
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activa?.mensajes?.length]);

  if (!open) return null;

  const peer = otherParticipant(activa, user.id);
  const inThread = Boolean(activa);

  const selectConv = async (id) => {
    setSendError("");
    setDraft("");
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

  const handleClose = () => {
    clearActiva();
    onClose();
  };

  const backToInbox = () => {
    clearActiva();
    setDraft("");
    setSendError("");
  };

  return (
    <div
      className={`msg-popup ${inThread ? "is-thread" : "is-inbox"}`}
      role="dialog"
      aria-label="Mensajes"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <header className="msg-popup-header">
        {inThread ? (
          <>
            <button type="button" className="msg-popup-icon-btn" onClick={backToInbox} aria-label="Volver">
              <BackIcon fontSize="small" />
            </button>
            <div className="msg-popup-peer">
              <div className="msg-popup-avatar sm">
                {(peer?.nombre || "?")[0]?.toUpperCase()}
              </div>
              <div className="msg-popup-peer-text">
                <strong>{peer?.nombre || "Chat"}</strong>
                <span>
                  {tipoLabel(activa.tipo)}
                  {activa.alojamiento_titulo ? ` · ${activa.alojamiento_titulo}` : ""}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="msg-popup-title">
            <ChatIcon fontSize="small" />
            <strong>Chats</strong>
          </div>
        )}

        <div className="msg-popup-actions">
          {!inThread && (
            <button
              type="button"
              className="msg-popup-icon-btn"
              title="Actualizar"
              onClick={() => fetchConversaciones()}
            >
              <RefreshIcon fontSize="small" />
            </button>
          )}
          <button type="button" className="msg-popup-icon-btn" onClick={handleClose} aria-label="Cerrar">
            <CloseIcon fontSize="small" />
          </button>
        </div>
      </header>

      {!inThread ? (
        <div className="msg-popup-list">
          {loading && conversaciones.length === 0 ? (
            <Spinner />
          ) : conversaciones.length === 0 ? (
            <EmptyState icon={<ChatIcon fontSize="inherit" />} message="Sin conversaciones aún" />
          ) : (
            conversaciones.map((c) => {
              const other = otherParticipant(c, user.id);
              const badge = formatUnreadBadge(c.no_leidos);
              return (
                <button
                  key={c.id}
                  type="button"
                  className="msg-popup-item"
                  onClick={() => selectConv(c.id)}
                >
                  <div className="msg-popup-avatar">
                    {(other?.nombre || "?")[0]?.toUpperCase()}
                  </div>
                  <div className="msg-popup-item-main">
                    <div className="msg-popup-item-top">
                      <strong>{other?.nombre || "Conversación"}</strong>
                      <span>{formatChatTime(c.ultimo_mensaje_at || c.updated_at)}</span>
                    </div>
                    <p className={badge ? "unread" : ""}>
                      {c.ultimo_mensaje || "Sin mensajes"}
                    </p>
                    <div className="msg-popup-item-meta">
                      <span className="badge badge-gray">{tipoLabel(c.tipo)}</span>
                      {c.alojamiento_titulo && <span>{c.alojamiento_titulo}</span>}
                    </div>
                  </div>
                  {badge && <span className="msg-unread-pill">{badge}</span>}
                </button>
              );
            })
          )}
          {error && <div className="alert alert-error" style={{ margin: 12 }}>{error}</div>}
        </div>
      ) : (
        <>
          <div className="msg-popup-messages">
            {(activa.mensajes || []).map((m) => {
              const mine = `${m.id_remitente}` === `${user.id}`;
              return (
                <div key={m.id} className={`chat-bubble-wrap ${mine ? "mine" : "theirs"}`}>
                  <div className={`chat-bubble ${mine ? "mine" : "theirs"}`}>
                    <p>{m.cuerpo}</p>
                    <time>{formatChatTime(m.created_at)}</time>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {sendError && <div className="alert alert-error" style={{ margin: "0 10px 8px" }}>{sendError}</div>}

          <div className="msg-popup-composer">
            <textarea
              className="form-input"
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Aa"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSend}
              disabled={sending || !draft.trim()}
            >
              {sending ? "..." : "Enviar"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessagesDrawer;
