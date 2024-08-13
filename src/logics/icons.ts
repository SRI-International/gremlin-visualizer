import { ICONS } from "../constants";

interface IconProvider {
  (label: string | undefined): string | null
}

/**
 returns icon for given node label
 */
const getIcon: IconProvider = (label: string | undefined) => {
  if (label === undefined) return null;
  const icon = (ICONS as Record<string, any>)[label];
  if (icon) {
    return icon;
  }
  return null;
}

export default getIcon;
