const GIS_SRC = 'https://accounts.google.com/gsi/client';

let scriptPromise = null;

export const getGoogleClientId = () =>
  import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || '';

export const isGoogleAuthConfigured = () => Boolean(getGoogleClientId());

const loadGoogleScript = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Sign-In solo funciona en el navegador'));
  }
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google));
      existing.addEventListener('error', () => reject(new Error('No se pudo cargar Google')));
      if (window.google?.accounts?.id) resolve(window.google);
      return;
    }

    const script = document.createElement('script');
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('No se pudo cargar Google Sign-In'));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
};

/**
 * Abre el flujo de Google Identity Services y resuelve con el JWT (credential).
 */
export const requestGoogleCredential = async () => {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error(
      "Falta VITE_GOOGLE_CLIENT_ID. Configura el Client ID de Google en el frontend."
    );
  }

  const google = await loadGoogleScript();

  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      fn(value);
    };

    const timeoutId = setTimeout(() => {
      finish(reject, new Error("Se agotó el tiempo de espera de Google. Intenta de nuevo."));
    }, 120000);

    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (!response?.credential) {
          finish(reject, new Error("Google no devolvió un token válido"));
          return;
        }
        finish(resolve, response.credential);
      },
      auto_select: false,
      cancel_on_tap_outside: true,
      context: "signin",
      ux_mode: "popup",
    });

    google.accounts.id.prompt((notification) => {
      if (settled) return;

      if (notification.isDismissedMoment?.()) {
        finish(reject, new Error("Inicio de sesión con Google cancelado."));
        return;
      }

      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        const host = document.createElement("div");
        host.style.position = "fixed";
        host.style.left = "-9999px";
        host.style.top = "0";
        host.setAttribute("aria-hidden", "true");
        document.body.appendChild(host);

        google.accounts.id.renderButton(host, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: 280,
        });

        const btn = host.querySelector('div[role="button"]');
        if (btn) {
          btn.click();
        } else {
          host.remove();
          finish(
            reject,
            new Error(
              "No se pudo abrir Google. Revisa que el origen esté autorizado en Google Cloud."
            )
          );
        }

        setTimeout(() => host.remove(), 8000);
      }
    });
  });
};
