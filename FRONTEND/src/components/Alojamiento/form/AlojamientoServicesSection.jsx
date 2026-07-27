import ServicePicker from "../ServicePicker";

export const AlojamientoServicesSection = ({ value, onChange }) => (
  <section style={{ marginBottom: "2rem" }}>
    <h3 className="display" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
      Servicios
    </h3>
    <ServicePicker
      value={value}
      onChange={onChange}
      label="Lo que ofrece este lugar"
      hint="Opcional: wifi, estacionamiento, vistas..."
    />
  </section>
);

export default AlojamientoServicesSection;
