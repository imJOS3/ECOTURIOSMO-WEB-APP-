
import CategoryPicker from "../../Alojamiento/CategoryPicker";

export const UnidadCategoriesSection = ({ value, onChange }) => (
  <section style={{ marginBottom: "2rem" }}>
    <h3 className="display" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Categorías</h3>
    <CategoryPicker
      tipo="unidad"
      value={value}
      onChange={onChange}
      label="Categorías de la unidad"
      hint="Solo se muestran categorías tipo unidad"
    />
  </section>
);

export default UnidadCategoriesSection;