import { useRef, useState, useEffect, useCallback } from "react";
import AlojamientoCard from "./AlojamientoCard";
import { ChevronRightIcon } from "./detailIcons";

/**
 * Carrusel horizontal de "Alojamientos cercanos" con flechas prev/next y
 * contador de página (1/2, 2/2...), reutilizando la AlojamientoCard.
 */
const SimilarListingsCarousel = ({ items, onOpen, title = "Alojamientos cercanos" }) => {
  const rowRef = useRef(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const recalc = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const pages = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
    setTotalPages(pages);
    setPage(Math.min(pages, Math.round(el.scrollLeft / el.clientWidth) + 1));
  }, []);

  useEffect(() => {
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [recalc, items]);

  const scrollByPage = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
    setTimeout(recalc, 350);
  };

  return (
    <div className="similar-listings-section">
      <div className="similar-listings-header">
        <h3 className="display" style={{ fontSize: "1.2rem" }}>{title}</h3>
        {totalPages > 1 && (
          <div className="similar-listings-nav">
            <span className="similar-listings-page">{page} / {totalPages}</span>
            <button
              className="similar-nav-btn"
              onClick={() => scrollByPage(-1)}
              disabled={page <= 1}
              aria-label="Anteriores"
            >
              <ChevronRightIcon size={16} style={{ transform: "rotate(180deg)" }} />
            </button>
            <button
              className="similar-nav-btn"
              onClick={() => scrollByPage(1)}
              disabled={page >= totalPages}
              aria-label="Siguientes"
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="similar-listings-row" ref={rowRef} onScroll={recalc}>
        {items.map((s) => (
          <div key={s.id} className="similar-card-wrap">
            <AlojamientoCard item={s} onClick={onOpen} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarListingsCarousel;