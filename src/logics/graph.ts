import { GRAPH_IMPL } from "../constants";
import { getCytoGraph } from "./graphImpl/cytoImpl";
import { getSigmaGraph } from "./graphImpl/sigmaImpl";
import { getVisNetwork } from "./graphImpl/visImpl";

const getGraph = (() => {
  if (GRAPH_IMPL === "cytoscape") {
    return getCytoGraph;
  } else if (GRAPH_IMPL === "sigma") {
    return getSigmaGraph;
  } else {
    return getVisNetwork;
  }
})();
export { getGraph };