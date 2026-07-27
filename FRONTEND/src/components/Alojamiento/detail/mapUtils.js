/** URL usable de una imagen (string o objeto del backend). */
export const imgUrl = (img) => (typeof img === "string" ? img : img?.url || img?.imagen_url);

/** Embed de OpenStreetMap sin API key. El pin se dibuja encima en la UI. */
export const buildMapEmbedUrl = (lat, lon) => {
  const d = 0.01;
  const bbox = `${lon - d}%2C${lat - d}%2C${lon + d}%2C${lat + d}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;
};

/**
 * Ubicación aproximada estable por id (seguridad del anfitrión).
 * Mismo seed → mismo punto entre visitas.
 */
export const fuzzCoord = (lat, lon, seedId) => {
  const seed = Number(seedId) || 1;
  const angle = ((seed * 137.5) % 360) * (Math.PI / 180);
  const distanceKm = 0.25 + (seed % 5) * 0.05;
  const dLat = (distanceKm / 111) * Math.cos(angle);
  const dLon = (distanceKm / (111 * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle);
  return { lat: lat + dLat, lon: lon + dLon };
};

export const averageRating = (resenas = []) => {
  if (!resenas.length) return null;
  const sum = resenas.reduce(
    (acc, r) => acc + (r.calificacion || r.puntuacion || 0),
    0
  );
  return (sum / resenas.length).toFixed(1);
};

export const yearsSince = (isoDate) => {
  const ms = Date.now() - new Date(isoDate).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24 * 365)));
};
