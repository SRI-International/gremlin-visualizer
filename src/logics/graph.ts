import { GRAPH_IMPL } from "../constants";
import { getCytoGraph, getNodePositions as getCytoNodePositions, setNodePositions as setCytoNodePositions, applyLayout as cytoLayout, layoutOptions as cytoLayouts  } from "./graphImpl/cytoImpl";
import { getSigmaGraph, getNodePositions as getSigmaNodePositions, setNodePositions as setSigmaNodePositions, applyLayout as sigmaLayout, layoutOptions as sigmaLayouts } from "./graphImpl/sigmaImpl";
import { getVisNetwork, getNodePositions as getVisNodePositions, setNodePositions as setVisNodePositions, applyLayout as visLayout, layoutOptions as visLayouts } from "./graphImpl/visImpl";

const { getGraph, getNodePositions, setNodePositions, applyLayout, layoutOptions } = (() => {
  if (GRAPH_IMPL === "cytoscape") {
    return { getGraph: getCytoGraph, getNodePositions: getCytoNodePositions, setNodePositions: setCytoNodePositions, applyLayout: cytoLayout, layoutOptions: cytoLayouts };
  } else if (GRAPH_IMPL === "sigma") {
    return { getGraph: getSigmaGraph, getNodePositions: getSigmaNodePositions, setNodePositions: setSigmaNodePositions, applyLayout: sigmaLayout, layoutOptions: sigmaLayouts };
  } else {
    return { getGraph: getVisNetwork, getNodePositions: getVisNodePositions, setNodePositions: setVisNodePositions, applyLayout: visLayout, layoutOptions: visLayouts };
  }
})();
export { getGraph, applyLayout, layoutOptions };