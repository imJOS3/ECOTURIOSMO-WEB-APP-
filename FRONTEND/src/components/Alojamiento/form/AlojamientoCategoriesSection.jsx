// src/components/alojamientos/form/AlojamientoCategoriesSection.jsx
import CategoryPicker from "../CategoryPicker";

export const AlojamientoCategoriesSection = ({ value, onChange }) => (
  <section style={{ marginBottom: "2rem" }}>
    <h3 className="display" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Categorías</h3>
    <CategoryPicker
      tipo="alojamiento"
      value={value}
      onChange={onChange}
      label="Categorías del alojamiento"
      hint="Solo se muestran categorías tipo alojamiento"
    />
  </section>
);

export default AlojamientoCategoriesSection;