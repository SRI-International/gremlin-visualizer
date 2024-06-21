import { GRAPH_IMPL } from "../constants";
import {
  applyLayout as cytoLayout,
  getCytoGraph,
  getNodePositions as getCytoNodePositions,
  layoutOptions as cytoLayouts,
  setNodePositions as setCytoNodePositions
} from "./graphImpl/cytoImpl";
import {
  applyLayout as sigmaLayout,
  getNodePositions as getSigmaNodePositions,
  getSigmaGraph,
  layoutOptions as sigmaLayouts,
  setNodePositions as setSigmaNodePositions
} from "./graphImpl/sigmaImpl";
import {
  applyLayout as visLayout,
  getNodePositions as getVisNodePositions,
  getVisNetwork,
  layoutOptions as visLayouts,
  setNodePositions as setVisNodePositions
} from "./graphImpl/visImpl";

const { getGraph, getNodePositions, setNodePositions, applyLayout, layoutOptions } = (() => {
  if (GRAPH_IMPL === "cytoscape") {
    return {
      getGraph: getCytoGraph,
      getNodePositions: getCytoNodePositions,
      setNodePositions: setCytoNodePositions,
      applyLayout: cytoLayout,
      layoutOptions: cytoLayouts
    };
  } else if (GRAPH_IMPL === "sigma") {
    return {
      getGraph: getSigmaGraph,
      getNodePositions: getSigmaNodePositions,
      setNodePositions: setSigmaNodePositions,
      applyLayout: sigmaLayout,
      layoutOptions: sigmaLayouts
    };
  } else {
    return {
      getGraph: getVisNetwork,
      getNodePositions: getVisNodePositions,
      setNodePositions: setVisNodePositions,
      applyLayout: visLayout,
      layoutOptions: visLayouts
    };
  }
})();
export { getGraph, getNodePositions, setNodePositions, applyLayout, layoutOptions };