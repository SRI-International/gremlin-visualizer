const icons: Record<string, string> = {
  // insert label to icon map here
  // person: require("./icons/person.jpg"),
  // place: require("./icons/place.jpg")
  Material: require("./icons/processing.png"),
  Component: require("./icons/abstract.png"),
  Entity: require("./icons/businessman.png")
};

interface IconProvider {
  (label: string | undefined): string | null
}

/**
 returns icon for given node label
 */
const getIcon: IconProvider = (label: string | undefined) => {
  if (label === undefined) return null;
  const icon = icons[label];
  if (icon) {
    return icon;
  }
  return null;
}

export default getIcon;
