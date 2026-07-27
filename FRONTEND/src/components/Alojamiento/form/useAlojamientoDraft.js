import { useCallback, useEffect, useRef, useState } from "react";
import { baseAlojamiento } from "../../../utils/formHelpers";

const DRAFT_PREFIX = "eco_alojamiento_draft";

const storageKey = (userId) =>
  `${DRAFT_PREFIX}:${userId || "anon"}`;

const readDraft = (userId) => {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.form || typeof parsed.form !== "object") return null;
    return {
      savedAt: parsed.savedAt || null,
      form: baseAlojamiento(parsed.form),
    };
  } catch {
    return null;
  }
};

const writeDraft = (userId, form) => {
  const payload = {
    savedAt: new Date().toISOString(),
    form: baseAlojamiento(form || {}),
  };
  localStorage.setItem(storageKey(userId), JSON.stringify(payload));
  return payload;
};

const removeDraft = (userId) => {
  localStorage.removeItem(storageKey(userId));
};

const formHasContent = (form) => {
  const f = baseAlojamiento(form || {});
  return Boolean(
    f.titulo.trim() ||
      f.descripcion.trim() ||
      f.ubicacion.trim() ||
      f.precio_noche ||
      f.capacidad ||
      f.categorias.length ||
      f.servicios.length ||
      f.latitud ||
      f.longitud
  );
};

/**
 * Borrador local del formulario de creación (SRP):
 * lee/escribe localStorage, no conoce la UI del banner.
 */
export const useAlojamientoDraft = ({ enabled, userId, form }) => {
  const [existingDraft, setExistingDraft] = useState(null);
  const [promptOpen, setPromptOpen] = useState(false);
  const [autosaveEnabled, setAutosaveEnabled] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const timerRef = useRef(null);
  const decidedRef = useRef(false);

  // Al entrar en creación: ¿hay borrador?
  useEffect(() => {
    if (!enabled) {
      setExistingDraft(null);
      setPromptOpen(false);
      setAutosaveEnabled(false);
      decidedRef.current = false;
      return;
    }

    const draft = readDraft(userId);
    if (draft && formHasContent(draft.form)) {
      setExistingDraft(draft);
      setPromptOpen(true);
      setAutosaveEnabled(false);
      decidedRef.current = false;
    } else {
      setExistingDraft(null);
      setPromptOpen(false);
      setAutosaveEnabled(true);
      decidedRef.current = true;
    }
  }, [enabled, userId]);

  // Autosave con debounce
  useEffect(() => {
    if (!enabled || !autosaveEnabled || !decidedRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      if (!formHasContent(form)) {
        removeDraft(userId);
        setLastSavedAt(null);
        return;
      }
      const saved = writeDraft(userId, form);
      setLastSavedAt(saved.savedAt);
      setExistingDraft(saved);
    }, 450);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, autosaveEnabled, form, userId]);

  const recoverDraft = useCallback(() => {
    const draft = existingDraft || readDraft(userId);
    decidedRef.current = true;
    setPromptOpen(false);
    setAutosaveEnabled(true);
    if (draft?.savedAt) setLastSavedAt(draft.savedAt);
    return draft?.form || null;
  }, [existingDraft, userId]);

  const discardDraft = useCallback(() => {
    removeDraft(userId);
    decidedRef.current = true;
    setExistingDraft(null);
    setPromptOpen(false);
    setAutosaveEnabled(true);
    setLastSavedAt(null);
  }, [userId]);

  const clearDraft = useCallback(() => {
    removeDraft(userId);
    setExistingDraft(null);
    setLastSavedAt(null);
  }, [userId]);

  return {
    promptOpen,
    existingDraft,
    lastSavedAt,
    recoverDraft,
    discardDraft,
    clearDraft,
  };
};

export default useAlojamientoDraft;
