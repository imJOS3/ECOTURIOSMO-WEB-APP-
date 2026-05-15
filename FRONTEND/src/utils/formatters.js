// Precio en pesos colombianos
export function formatPrecio(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(valor)
}

// Fecha legible en español
export function formatFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

// Fecha corta dd/mm/aaaa
export function formatFechaCorta(fecha) {
  return new Date(fecha).toLocaleDateString('es-CO')
}

// Días entre dos fechas
export function calcularDias(inicio, fin) {
  const ms = new Date(fin) - new Date(inicio)
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}

// Estrellas como array p/ v-for
export function estrellas(calificacion, max = 5) {
  return Array.from({ length: max }, (_, i) => i < Math.round(calificacion))
}

// Capitalizar primera letra
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Truncar texto
export function truncar(str, max = 120) {
  if (!str || str.length <= max) return str
  return str.slice(0, max).trimEnd() + '…'
}
