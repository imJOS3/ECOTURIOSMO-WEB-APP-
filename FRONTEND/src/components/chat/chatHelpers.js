export const tipoLabel = (tipo) => (tipo === "moderacion" ? "Moderación" : "Consulta");

export const otherParticipant = (conv, userId) =>
  (conv?.participantes || []).find((p) => `${p.id}` !== `${userId}`);

export const formatChatTime = (iso) => {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    if (sameDay) {
      return date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
};

/** Badge: 0 → null, 1-99 → "+N", 100+ → "+99" */
export const formatUnreadBadge = (count) => {
  const n = Number(count) || 0;
  if (n <= 0) return null;
  if (n > 99) return "+99";
  return `+${n}`;
};

export const sumUnread = (conversaciones = []) =>
  conversaciones.reduce((acc, c) => acc + (Number(c.no_leidos) || 0), 0);
