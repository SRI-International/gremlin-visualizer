
const icons: Record<string, string> = {
  // insert label to icon map here
  // person: require("./icons/person.png")
};

interface IconProvider {
  (label: string): string | null
}

/**
 returns icon for given node label
 */
const getIcon: IconProvider = (label: string) => {
  const icon = icons[label];
  if (icon) {
    return icon;
  }
  return null;
}

export default getIcon;
