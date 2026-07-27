import { DETAIL_SECTIONS } from "./constants";

export const DetailSubnav = ({ sections = DETAIL_SECTIONS, onNavigate }) => (
  <div className="section-subnav">
    {sections.map((section) => (
      <button
        key={section.id}
        className="section-subnav-item"
        onClick={() => onNavigate(section.id)}
      >
        {section.label}
      </button>
    ))}
  </div>
);

export default DetailSubnav;
