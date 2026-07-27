import { AmenityIcon } from "../amenityIcons";

export const DetailAmenities = ({ categorias }) => {
  if (!categorias?.length) return null;

  return (
    <div id="sec-experiencia" style={{ marginBottom: "2rem" }}>
      <h3 className="display" style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
        Experiencia
      </h3>
      <div className="amenities-grid">
        {categorias.map((categoria) => (
          <div key={categoria.id || categoria.nombre} className="amenity-item">
            <AmenityIcon icono={categoria.icono} nombre={categoria.nombre} size={18} />
            <span>{categoria.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailAmenities;
