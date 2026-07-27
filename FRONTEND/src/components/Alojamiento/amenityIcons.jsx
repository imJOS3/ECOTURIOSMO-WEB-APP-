import { CheckIcon } from "./detailIcons";

const Svg = ({ size = 22, children, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

export const WifiIcon = (p) => (
  <Svg {...p}>
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
  </Svg>
);

export const ParkingIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
  </Svg>
);

export const MountainIcon = (p) => (
  <Svg {...p}>
    <path d="m8 18 4-7 2.5 4.5L17 12l4 6H3z" />
    <path d="M14 11.5 16 8l5 10" />
  </Svg>
);

export const WavesIcon = (p) => (
  <Svg {...p}>
    <path d="M2 12c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0" />
    <path d="M2 17c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0" />
    <path d="M2 7c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0" />
  </Svg>
);

export const BeachIcon = (p) => (
  <Svg {...p}>
    <path d="M2 20h20" />
    <path d="M12 4v9" />
    <path d="M12 8c4 0 7 2 8 5" />
    <path d="M12 8C8 8 5 10 4 13" />
    <path d="M6 20c1-3 3-5 6-5s5 2 6 5" />
  </Svg>
);

export const DeskIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="8" width="18" height="3" rx="1" />
    <path d="M6 11v7" />
    <path d="M18 11v7" />
    <path d="M10 11v3" />
    <path d="M14 4h4v4h-4z" />
  </Svg>
);

export const PetsIcon = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="4" r="2" />
    <circle cx="18" cy="8" r="2" />
    <circle cx="20" cy="16" r="2" />
    <path d="M9 10a5 5 0 0 0-4.5 7.5c1 1.5 3 2.5 5.5 2.5 4 0 7-2.5 7-6a4.5 4.5 0 0 0-4-4.5 4.8 4.8 0 0 0-4 0Z" />
  </Svg>
);

export const TvIcon = (p) => (
  <Svg {...p}>
    <rect x="2" y="7" width="20" height="12" rx="2" />
    <path d="m17 2-5 5-5-5" />
  </Svg>
);

export const CameraIcon = (p) => (
  <Svg {...p}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </Svg>
);

export const KitchenIcon = (p) => (
  <Svg {...p}>
    <path d="M4 3h2v7a2 2 0 0 1-2 2v9" />
    <path d="M8 3h2v7a2 2 0 0 1-2 2" />
    <path d="M18 3v18" />
    <path d="M15 8h6" />
    <path d="M15 12h6" />
  </Svg>
);

export const JacuzziIcon = (p) => (
  <Svg {...p}>
    <path d="M4 14c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" />
    <path d="M4 18c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" />
    <path d="M7 6v4" />
    <path d="M12 4v6" />
    <path d="M17 6v4" />
  </Svg>
);

export const BathIcon = (p) => (
  <Svg {...p}>
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 1 2-2L11 4" />
    <path d="M4 14h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2Z" />
    <path d="M6 14V9a2 2 0 0 1 2-2h3" />
  </Svg>
);

export const AcIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="8" rx="2" />
    <path d="M8 17v2" />
    <path d="M12 16v3" />
    <path d="M16 17v2" />
    <path d="M7 9h10" />
  </Svg>
);

export const BalconyIcon = (p) => (
  <Svg {...p}>
    <path d="M4 20V10l8-6 8 6v10" />
    <path d="M4 14h16" />
    <path d="M8 14v6" />
    <path d="M12 14v6" />
    <path d="M16 14v6" />
  </Svg>
);

export const ShieldAmenityIcon = (p) => (
  <Svg {...p}>
    <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
  </Svg>
);

export const FirstAidIcon = (p) => (
  <Svg {...p}>
    <path d="M8 2h8v4h4v8h-4v4H8v-4H4V6h4V2z" />
    <path d="M12 8v6" />
    <path d="M9 11h6" />
  </Svg>
);

export const HeaterIcon = (p) => (
  <Svg {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 7v10" />
    <path d="M12 7v10" />
    <path d="M15 7v10" />
  </Svg>
);

export const WasherIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="12" cy="13" r="5" />
    <circle cx="8" cy="7" r="1" fill="currentColor" stroke="none" />
    <circle cx="11" cy="7" r="1" fill="currentColor" stroke="none" />
  </Svg>
);

export const GlampingIcon = (p) => (
  <Svg {...p}>
    <path d="m12 3 9 18H3L12 3z" />
    <path d="M12 3v18" />
    <path d="M7.5 14h9" />
  </Svg>
);

export const PhoneOffIcon = (p) => (
  <Svg {...p}>
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
    <path d="m2 2 20 20" />
  </Svg>
);

export const HeartAmenityIcon = (p) => (
  <Svg {...p}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
  </Svg>
);

export const LeafIcon = (p) => (
  <Svg {...p}>
    <path d="M12 21c-4.5 0-8-3.5-8-8 0-6 8-11 8-11s8 5 8 11c0 4.5-3.5 8-8 8Z" />
    <path d="M12 21V9" />
  </Svg>
);

export const UsersIcon = (p) => (
  <Svg {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

export const AdventureIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </Svg>
);

export const HomeAmenityIcon = (p) => (
  <Svg {...p}>
    <path d="m3 10 9-7 9 7" />
    <path d="M5 9v11h14V9" />
  </Svg>
);

/** Slugs conocidos (BD + fallbacks por nombre). */
export const AMENITY_ICON_MAP = {
  wifi: WifiIcon,
  parking: ParkingIcon,
  mountain: MountainIcon,
  waves: WavesIcon,
  beach: BeachIcon,
  desk: DeskIcon,
  pets: PetsIcon,
  tv: TvIcon,
  camera: CameraIcon,
  kitchen: KitchenIcon,
  jacuzzi: JacuzziIcon,
  bath: BathIcon,
  ac: AcIcon,
  balcony: BalconyIcon,
  shield: ShieldAmenityIcon,
  first_aid: FirstAidIcon,
  heater: HeaterIcon,
  washer: WasherIcon,
  glamping: GlampingIcon,
  camping: GlampingIcon,
  phone_off: PhoneOffIcon,
  heart: HeartAmenityIcon,
  romantico: HeartAmenityIcon,
  leaf: LeafIcon,
  users: UsersIcon,
  adventure: AdventureIcon,
  home: HomeAmenityIcon,
  check: CheckIcon,
};

export const AMENITY_ICON_OPTIONS = Object.keys(AMENITY_ICON_MAP)
  .filter((slug) => slug !== "camping" && slug !== "romantico")
  .sort();

const NAME_ALIASES = {
  wifi: "wifi",
  "estacionamiento gratis": "parking",
  estacionamiento: "parking",
  "vista a las montañas": "mountain",
  "vista a la montaña": "mountain",
  "vista al oceano": "waves",
  "vista al océano": "waves",
  "acceso a la playa": "beach",
  "zona de trabajo": "desk",
  "se permiten mascotas": "pets",
  "pet friendly": "pets",
  televisor: "tv",
  "camaras de seguridad exteriores": "camera",
  "cámaras de seguridad exteriores": "camera",
  cocina: "kitchen",
  jacuzzi: "jacuzzi",
  "baño privado": "bath",
  "bano privado": "bath",
  "aire acondicionado": "ac",
  balcon: "balcony",
  balcón: "balcony",
  "detector de humo": "shield",
  botiquin: "first_aid",
  botiquín: "first_aid",
  calefaccion: "heater",
  calefacción: "heater",
  lavadora: "washer",
  glamping: "glamping",
  camping: "camping",
  "desconexion digital": "phone_off",
  "desconexión digital": "phone_off",
  romantico: "heart",
  romántico: "heart",
  "ideal para parejas": "heart",
  naturaleza: "leaf",
  ecoturismo: "leaf",
  bosque: "leaf",
  mirador: "mountain",
  montana: "mountain",
  montaña: "mountain",
  "vista panoramica": "mountain",
  "vista panorámica": "mountain",
  "vista al bosque": "mountain",
  "conocer personas": "users",
  familiar: "users",
  "habitacion compartida": "users",
  "habitación compartida": "users",
  aventura: "adventure",
  "habitacion privada": "home",
  "habitación privada": "home",
};

export const normalizeAmenityKey = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

/**
 * Resuelve un componente de icono a partir de `icono` (slug BD)
 * o del `nombre` legible. Fallback: CheckIcon.
 */
export const resolveAmenityIcon = (iconoOrItem, maybeNombre) => {
  let icono = iconoOrItem;
  let nombre = maybeNombre;

  if (iconoOrItem && typeof iconoOrItem === "object") {
    icono = iconoOrItem.icono;
    nombre = iconoOrItem.nombre;
  }

  if (icono && AMENITY_ICON_MAP[icono]) {
    return AMENITY_ICON_MAP[icono];
  }

  const key = normalizeAmenityKey(nombre || icono || "");
  const alias = NAME_ALIASES[key];
  if (alias && AMENITY_ICON_MAP[alias]) {
    return AMENITY_ICON_MAP[alias];
  }

  return CheckIcon;
};

export const AmenityIcon = ({ icono, nombre, size = 22, ...props }) => {
  const Icon = resolveAmenityIcon({ icono, nombre });
  return <Icon size={size} {...props} />;
};
