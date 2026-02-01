import {
  FileText,
  Truck,
  Building2,
  Building,
  Box,
  Layers,
  Home,
  Hammer,
  Droplets,
  Zap,
  ThermometerSun,
  Paintbrush,
  Square,
  Ruler,
  LayoutGrid,
  ChefHat,
  TreePine,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/** Map trade category names to Lucide icons for visual bucketing */
export const TRADE_CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Professional Services": FileText,
  "Site Work & Excavation": Truck,
  "Foundation & Concrete": Building2,
  "Post-Frame Builder": Building,
  "ICF Installer": Box,
  "SIP Installer": Layers,
  "Modular Home Dealer": Home,
  "Framing Contractor": Hammer,
  Roofing: Building,
  Plumbing: Droplets,
  Electrical: Zap,
  HVAC: ThermometerSun,
  "Exterior Finishes": Paintbrush,
  Insulation: Layers,
  Drywall: Square,
  "Trim Carpentry": Ruler,
  Painting: Paintbrush,
  Flooring: LayoutGrid,
  "Cabinets & Countertops": ChefHat,
  "Decks & Outdoor": TreePine,
  "Final Finishes": Sparkles,
};

/** Default icon for uncategorized or unknown trade */
export const DEFAULT_TRADE_ICON = Building2;

export function getTradeIcon(tradeName: string | null | undefined): LucideIcon {
  if (!tradeName?.trim()) return DEFAULT_TRADE_ICON;
  return TRADE_CATEGORY_ICONS[tradeName] ?? DEFAULT_TRADE_ICON;
}
