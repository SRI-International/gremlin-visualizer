import { GRAPH_IMPL } from "../constants";
import { getCytoGraph, applyLayout as cytoLayout, layoutOptions as cytoLayouts  } from "./graphImpl/cytoImpl";
import { getSigmaGraph, applyLayout as sigmaLayout, layoutOptions as sigmaLayouts } from "./graphImpl/sigmaImpl";
import { getVisNetwork, layoutOptions as visLayouts } from "./graphImpl/visImpl";

const { getGraph, applyLayout, layoutOptions } = (() => {
  if (GRAPH_IMPL === "cytoscape") {
    return { getGraph: getCytoGraph, applyLayout: cytoLayout, layoutOptions: cytoLayouts };
  } else if (GRAPH_IMPL === "sigma") {
    return { getGraph: getSigmaGraph, applyLayout: sigmaLayout, layoutOptions: sigmaLayouts };
  } else {
    return { getGraph: getVisNetwork, applyLayout: sigmaLayout, layoutOptions: visLayouts };
  }
})();
export { getGraph, applyLayout, layoutOptions };