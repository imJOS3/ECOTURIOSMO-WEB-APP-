import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageLightbox from "../../common/ui/ImageLightbox";
import { BackIcon } from "../../common/icons/icons";
import HostSection from "../HostSection";
import SimilarListingsCarousel from "../SimilarListingsCarousel";
import { PLACEHOLDER_RULES } from "../placeholderData";
import { buildDetailViewModel } from "./buildDetailViewModel";
import { useAlojamientoDetail } from "./useAlojamientoDetail";
import DetailHeader from "./DetailHeader";
import DetailGallery from "./DetailGallery";
import DetailSubnav from "./DetailSubnav";
import DetailHighlightStrip from "./DetailHighlightStrip";
import DetailDescription from "./DetailDescription";
import DetailAmenities from "./DetailAmenities";
import DetailServices from "./DetailServices";
import DetailLocation from "./DetailLocation";
import DetailReviews from "./DetailReviews";
import DetailBookingSidebar from "./DetailBookingSidebar";
import DetailMobileBookBar from "./DetailMobileBookBar";
import "../../../styles/alojamiento-detail.css";

/**
 * Orquestador del detalle (composition root).
 * - Carga datos vía hook
 * - Mapea a view-model puro
 * - Compone secciones presentacionales
 * No contiene markup de secciones ni reglas de negocio.
 */
const AlojamientoDetail = ({ item, user, onBack, onReserve, onMessageHost }) => {
  const navigate = useNavigate();
  const { resenas, imagenes, similares, createResena } = useAlojamientoDetail(item.id);

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const vm = useMemo(
    () => buildDetailViewModel({ item, imagenes, resenas }),
    [item, imagenes, resenas]
  );

  const shareLink = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: item.titulo, url });
        return;
      } catch {
        /* usuario canceló */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleReserve = () => onReserve(item);

  return (
    <div>
      <button className="btn btn-sm" onClick={onBack} style={{ marginBottom: "1.25rem" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <BackIcon fontSize="small" /> Volver
        </span>
      </button>

      <DetailHeader
        titulo={vm.titulo}
        metaStats={vm.metaStats}
        ubicacion={vm.ubicacion}
        estado={vm.estado}
        avgRating={vm.avgRating}
        reviewCount={vm.reviewCount}
        copied={copied}
        saved={saved}
        onShare={shareLink}
        onToggleSave={() => setSaved((s) => !s)}
      />

      <div id="sec-fotos">
        <DetailGallery
          images={vm.galleryImages}
          seedId={item.id}
          onOpenLightbox={setLightboxIndex}
        />
      </div>

      <DetailSubnav onNavigate={scrollToSection} />

      <div className="detail-layout">
        <div>
          <DetailHighlightStrip
            avgRating={vm.avgRating}
            reviewCount={vm.reviewCount}
            esFavorito={vm.esFavorito}
          />

          <DetailDescription
            descripcion={vm.descripcion}
            expanded={showFullDesc}
            onToggle={() => setShowFullDesc((s) => !s)}
          />

          <DetailAmenities categorias={vm.categorias} />

          <DetailServices servicios={vm.servicios} />

          <DetailLocation ubicacion={vm.ubicacion} approx={vm.approx} />

          <DetailReviews
            resenas={resenas}
            avgRating={vm.avgRating}
            user={user}
            onSubmit={createResena}
          />
        </div>

        <DetailBookingSidebar
          precioNoche={vm.precioNoche}
          avgRating={vm.avgRating}
          reviewCount={vm.reviewCount}
          coords={vm.coords}
          categoriasCount={vm.categorias.length}
          serviciosCount={vm.servicios.length}
          user={user}
          onReserve={handleReserve}
        />
      </div>

      <HostSection host={vm.host} rules={PLACEHOLDER_RULES} onMessageHost={onMessageHost} />

      {similares.length > 0 && (
        <SimilarListingsCarousel
          items={similares}
          onOpen={(it) => navigate(`/alojamientos/${it.id}`)}
        />
      )}

      <ImageLightbox
        images={vm.galleryImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />

      <DetailMobileBookBar
        precioNoche={vm.precioNoche}
        avgRating={vm.avgRating}
        onReserve={handleReserve}
      />
    </div>
  );
};

export default AlojamientoDetail;
