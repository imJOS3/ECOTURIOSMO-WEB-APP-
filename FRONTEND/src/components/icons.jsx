import NatureOutlined from "@mui/icons-material/NatureOutlined";
import HomeWorkOutlined from "@mui/icons-material/HomeWorkOutlined";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined";
import MapOutlined from "@mui/icons-material/MapOutlined";
import TravelExploreOutlined from "@mui/icons-material/TravelExploreOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import RefreshOutlined from "@mui/icons-material/RefreshOutlined";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import BedroomParentOutlined from "@mui/icons-material/BedroomParentOutlined";
import AdminPanelSettingsOutlined from "@mui/icons-material/AdminPanelSettingsOutlined";
import FactCheckOutlined from "@mui/icons-material/FactCheckOutlined";
import CottageOutlined from "@mui/icons-material/CottageOutlined";
import ForestOutlined from "@mui/icons-material/ForestOutlined";
import SpaOutlined from "@mui/icons-material/SpaOutlined";
import WaterOutlined from "@mui/icons-material/WaterOutlined";
import TerrainOutlined from "@mui/icons-material/TerrainOutlined";
import LocalFloristOutlined from "@mui/icons-material/LocalFloristOutlined";
import ParkOutlined from "@mui/icons-material/ParkOutlined";
import CabinOutlined from "@mui/icons-material/CabinOutlined";
import WbSunnyOutlined from "@mui/icons-material/WbSunnyOutlined";
import LandscapeOutlined from "@mui/icons-material/LandscapeOutlined";

export const BrandIcon = NatureOutlined;
export const LodgingIcon = HomeWorkOutlined;
export const ExplorerIcon = TravelExploreOutlined;
export const HomeIcon = CottageOutlined;
export const CalendarIcon = EventAvailableOutlined;
export const MapIcon = MapOutlined;
export const UserIcon = PersonOutlineOutlined;
export const LockIcon = LockOutlined;
export const CloseIcon = CloseOutlined;
export const RefreshIcon = RefreshOutlined;
export const SuccessIcon = CheckCircleOutlineOutlined;
export const ErrorIcon = CancelOutlined;
export const BackIcon = ArrowBackOutlined;
export const PaymentIcon = PaymentsOutlined;
export const TagIcon = LocalOfferOutlined;
export const GroupIcon = GroupOutlined;
export const BedIcon = BedroomParentOutlined;
export const AdminIcon = AdminPanelSettingsOutlined;
export const ReviewIcon = FactCheckOutlined;

export const NatureIcons = [
  NatureOutlined,
  ForestOutlined,
  SpaOutlined,
  WaterOutlined,
  TerrainOutlined,
  LocalFloristOutlined,
  ParkOutlined,
  CabinOutlined,
  WbSunnyOutlined,
  LandscapeOutlined,
];

export const IconLabel = ({ icon: Icon, children, style, ...props }) => (
  <span
    {...props}
    style={{ display: "inline-flex", alignItems: "center", gap: 6, ...style }}
  >
    <Icon fontSize="small" />
    <span>{children}</span>
  </span>
);