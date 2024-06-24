import { GRAPH_IMPL } from "../constants";
import { getCytoGraph, getNodePositions as getCytoNodePositions, setNodePositions as setCytoNodePositions, applyLayout as cytoLayout, layoutOptions as cytoLayouts, zoomIn as cytoZoomIn, zoomOut as cytoZoomOut, fitTo as cytoFitTo} from "./graphImpl/cytoImpl";
import { getSigmaGraph, getNodePositions as getSigmaNodePositions, setNodePositions as setSigmaNodePositions, applyLayout as sigmaLayout, layoutOptions as sigmaLayouts, zoomIn as sigmaZoomIn, zoomOut as sigmaZoomOut, fitTo as sigmaFitTo} from "./graphImpl/sigmaImpl";
import { getVisNetwork, getNodePositions as getVisNodePositions, setNodePositions as setVisNodePositions, applyLayout as visLayout, layoutOptions as visLayouts, zoomIn as visZoomIn, zoomOut as visZoomOut, fitTo as visFitTo} from "./graphImpl/visImpl";

const { getGraph, getNodePositions, setNodePositions, applyLayout, layoutOptions, zoomIn, zoomOut, fitTo } = (() => {
  if (GRAPH_IMPL === "cytoscape") {
    return { getGraph: getCytoGraph, getNodePositions: getCytoNodePositions, setNodePositions: setCytoNodePositions, applyLayout: cytoLayout, layoutOptions: cytoLayouts, zoomIn : cytoZoomIn, zoomOut : cytoZoomOut, fitTo : cytoFitTo};
  } else if (GRAPH_IMPL === "sigma") {
    return { getGraph: getSigmaGraph, getNodePositions: getSigmaNodePositions, setNodePositions: setSigmaNodePositions, applyLayout: sigmaLayout, layoutOptions: sigmaLayouts, zoomIn : sigmaZoomIn, zoomOut : sigmaZoomOut, fitTo : sigmaFitTo};
  } else {
    return { getGraph: getVisNetwork, getNodePositions: getVisNodePositions, setNodePositions: setVisNodePositions, applyLayout: visLayout, layoutOptions: visLayouts, zoomIn : visZoomIn, zoomOut : visZoomOut, fitTo : visFitTo };
  }
})();
export { getGraph, getNodePositions, setNodePositions, applyLayout, layoutOptions, zoomIn, zoomOut, fitTo };