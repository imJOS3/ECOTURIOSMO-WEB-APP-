// src/components/common/ui/StarRating.jsx

// Única responsabilidad: pintar N de 5 estrellas para una calificación.
export const StarRating = ({ value = 0 }) => (
  <span className="stars">
    {"★".repeat(Math.min(value, 5))}
    {"☆".repeat(Math.max(0, 5 - value))}
  </span>
);

export default StarRating;