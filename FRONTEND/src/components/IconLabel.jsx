const IconLabel = ({ icon: Icon, children, style, ...props }) => (
  <span
    {...props}
    style={{ display: "inline-flex", alignItems: "center", gap: 6, ...style }}
  >
    <Icon fontSize="small" />
    <span>{children}</span>
  </span>
);

export default IconLabel;
