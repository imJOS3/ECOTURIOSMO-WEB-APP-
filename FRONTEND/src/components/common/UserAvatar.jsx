/**
 * Avatar circular: foto de perfil o inicial del nombre.
 */
const UserAvatar = ({ user, className = "", size }) => {
  const name = user?.nombre || "U";
  const url = user?.avatar_url;
  const style = size
    ? { width: size, height: size, fontSize: `calc(${typeof size === "number" ? `${size}px` : size} * 0.4)` }
    : undefined;

  if (url) {
    return (
      <img
        className={`avatar avatar-img ${className}`.trim()}
        src={url}
        alt={name}
        style={style}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className={`avatar ${className}`.trim()} style={style} aria-hidden>
      {name[0]?.toUpperCase() || "U"}
    </div>
  );
};

export default UserAvatar;
