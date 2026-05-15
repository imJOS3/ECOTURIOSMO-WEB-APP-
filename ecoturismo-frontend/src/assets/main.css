/* ═══════════════════════════════════════════════════════════
   EcoTurismo Experiencial — Sistema de diseño global
   Paleta: verde selva + crema natural + tierra
   Tipografía: Fraunces (display) + DM Sans (cuerpo)
   ═══════════════════════════════════════════════════════════ */

@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ── Variables de diseño ───────────────────────────────── */
:root {
  /* Colores primarios */
  --eco-green-50:  #f0faf4;
  --eco-green-100: #d4f0e0;
  --eco-green-200: #a8dfc2;
  --eco-green-400: #4caf7d;
  --eco-green-600: #1e7d4a;
  --eco-green-700: #155c36;
  --eco-green-800: #0d3d23;
  --eco-green-900: #072617;

  /* Crema / neutros cálidos */
  --eco-cream-50:  #fdfcf8;
  --eco-cream-100: #f5f2ea;
  --eco-cream-200: #e8e2d4;
  --eco-cream-400: #c5b99a;
  --eco-cream-600: #9a8b6e;

  /* Tierra / acento */
  --eco-earth-400: #c2874a;
  --eco-earth-600: #9a6030;

  /* Semánticos */
  --color-primary:        var(--eco-green-600);
  --color-primary-light:  var(--eco-green-100);
  --color-primary-dark:   var(--eco-green-800);
  --color-accent:         var(--eco-earth-400);
  --color-bg:             var(--eco-cream-50);
  --color-surface:        #ffffff;
  --color-border:         var(--eco-cream-200);
  --color-text:           #1a1a18;
  --color-text-muted:     var(--eco-cream-600);
  --color-success:        var(--eco-green-600);
  --color-error:          #c0392b;
  --color-warning:        var(--eco-earth-400);

  /* Tipografía */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;

  /* Espaciado base */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* Layout */
  --container-max: 1200px;
  --nav-height: 68px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* Sombras */
  --shadow-sm: 0 1px 3px rgba(0,0,0,.07), 0 1px 2px rgba(0,0,0,.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.05);
  --shadow-lg: 0 12px 32px rgba(0,0,0,.1), 0 4px 8px rgba(0,0,0,.06);

  /* Transiciones */
  --transition: 200ms ease;
  --transition-slow: 350ms ease;
}

/* ── Reset y base ─────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.65;
  color: var(--color-text);
  background-color: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }

/* ── Tipografía ────────────────────────────────────────── */
h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-primary-dark);
}

h1 { font-size: clamp(2rem, 4vw, 3rem); }
h2 { font-size: clamp(1.5rem, 3vw, 2.25rem); }
h3 { font-size: clamp(1.2rem, 2vw, 1.5rem); }

h4, h5, h6 {
  font-family: var(--font-body);
  font-weight: 600;
  line-height: 1.3;
}

h4 { font-size: 1.1rem; }
h5 { font-size: 1rem; }

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition);
}
a:hover { color: var(--color-primary-dark); }

/* ── Layout helpers ─────────────────────────────────── */
.container {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--space-6);
}

.page-wrapper {
  min-height: 100vh;
  padding-top: var(--nav-height);
}

/* ── Botones ────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 10px 22px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: background var(--transition), color var(--transition),
              border-color var(--transition), transform var(--transition),
              box-shadow var(--transition);
  white-space: nowrap;
  text-decoration: none;
}

.btn:active { transform: scale(0.97); }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }

.btn-primary {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.btn-primary:hover:not(:disabled) {
  background: var(--eco-green-700);
  border-color: var(--eco-green-700);
  box-shadow: 0 4px 14px rgba(30,125,74,.3);
}

.btn-outline {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.btn-outline:hover:not(:disabled) {
  background: var(--color-primary-light);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-muted);
  border-color: transparent;
}
.btn-ghost:hover:not(:disabled) {
  background: var(--eco-cream-100);
  color: var(--color-text);
}

.btn-accent {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}
.btn-accent:hover:not(:disabled) {
  background: var(--eco-earth-600);
  border-color: var(--eco-earth-600);
}

.btn-sm { padding: 6px 14px; font-size: 0.82rem; }
.btn-lg { padding: 14px 32px; font-size: 1rem; }
.btn-block { width: 100%; }

/* ── Formularios ─────────────────────────────────────── */
.form-group { display: flex; flex-direction: column; gap: var(--space-1); }

.form-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--eco-green-800);
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.95rem;
  transition: border-color var(--transition), box-shadow var(--transition);
}

.form-input::placeholder { color: var(--color-text-muted); opacity: 0.7; }

.form-input:focus {
  outline: none;
  border-color: var(--eco-green-400);
  box-shadow: 0 0 0 3px rgba(76,175,125,.15);
}

.form-input.error { border-color: var(--color-error); }
.form-error { font-size: 0.8rem; color: var(--color-error); }
.form-hint  { font-size: 0.8rem; color: var(--color-text-muted); }

/* Select */
.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239a8b6e' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

/* ── Cards ───────────────────────────────────────────── */
.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: box-shadow var(--transition), transform var(--transition);
}

.card:hover { box-shadow: var(--shadow-md); }
.card-body { padding: var(--space-6); }
.card-img { width: 100%; height: 200px; object-fit: cover; }

/* ── Badges ──────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-green  { background: var(--eco-green-100); color: var(--eco-green-700); }
.badge-cream  { background: var(--eco-cream-100); color: var(--eco-cream-600); }
.badge-earth  { background: #faeedd; color: var(--eco-earth-600); }
.badge-error  { background: #fdecea; color: var(--color-error); }

/* ── Utilidades ──────────────────────────────────────── */
.text-primary  { color: var(--color-primary); }
.text-muted    { color: var(--color-text-muted); }
.text-sm       { font-size: 0.875rem; }
.text-xs       { font-size: 0.75rem; }
.text-center   { text-align: center; }
.font-display  { font-family: var(--font-display); }
.font-medium   { font-weight: 500; }
.font-semibold { font-weight: 600; }

.flex         { display: flex; }
.flex-col     { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: var(--space-2); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }

.w-full  { width: 100%; }
.mt-4 { margin-top: var(--space-4); }
.mt-6 { margin-top: var(--space-6); }
.mb-4 { margin-bottom: var(--space-4); }

/* ── Transiciones de ruta (Vue Router) ─────────────── */
.fade-enter-active,
.fade-leave-active { transition: opacity var(--transition-slow); }
.fade-enter-from,
.fade-leave-to    { opacity: 0; }

.slide-up-enter-active { transition: opacity 300ms ease, transform 300ms ease; }
.slide-up-leave-active { transition: opacity 200ms ease; }
.slide-up-enter-from   { opacity: 0; transform: translateY(16px); }
.slide-up-leave-to     { opacity: 0; }

/* ── Toast personalizado ─────────────────────────────── */
.eco-toast {
  font-family: var(--font-body) !important;
  font-size: 0.9rem !important;
  border-radius: var(--radius-md) !important;
  border-left: 3px solid var(--color-primary) !important;
}

/* ── Scrollbar personalizado ─────────────────────────── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--eco-cream-100); }
::-webkit-scrollbar-thumb {
  background: var(--eco-green-200);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover { background: var(--eco-green-400); }

/* ── Spinner / loading ───────────────────────────────── */
.spinner {
  width: 36px; height: 36px;
  border: 3px solid var(--eco-green-100);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Estrellas de calificación ───────────────────────── */
.stars { display: flex; gap: 2px; color: var(--eco-earth-400); font-size: 0.9rem; }
.star-empty { color: var(--eco-cream-400); }

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 768px) {
  .container { padding-inline: var(--space-4); }
  .btn-lg { padding: 12px 24px; }
}

@media (max-width: 480px) {
  .container { padding-inline: var(--space-3); }
}
