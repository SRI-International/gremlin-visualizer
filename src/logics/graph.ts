import { GRAPH_IMPL } from "../constants";
import { getCytoGraph, getNodePositions as getCytoNodePositions, setNodePositions as setCytoNodePositions, applyLayout as cytoLayout, layoutOptions as cytoLayouts, zoomIn as cytoZoomIn, zoomOut as cytoZoomOut, fitTo as cytoFitTo, exportIMG as cytoExportIMG, configCytoGraphConnection } from "./graphImpl/cytoImpl";
import { getSigmaGraph, getNodePositions as getSigmaNodePositions, setNodePositions as setSigmaNodePositions, applyLayout as sigmaLayout, layoutOptions as sigmaLayouts, zoomIn as sigmaZoomIn, zoomOut as sigmaZoomOut, fitTo as sigmaFitTo, exportIMG as sigmaExportIMG } from "./graphImpl/sigmaImpl";
import { getVisNetwork, getNodePositions as getVisNodePositions, setNodePositions as setVisNodePositions, applyLayout as visLayout, layoutOptions as visLayouts, zoomIn as visZoomIn, zoomOut as visZoomOut, fitTo as visFitTo, exportIMG as visExportIMG } from "./graphImpl/visImpl";
import { Add, CenterFocusStrong, Remove } from '@mui/icons-material';
import IosShareIcon from '@mui/icons-material/IosShare';

const { getGraph, getNodePositions, setNodePositions, applyLayout, configGraphConnection, layoutOptions } = (() => {
  if (GRAPH_IMPL === "cytoscape") {
    return { getGraph: getCytoGraph, getNodePositions: getCytoNodePositions, setNodePositions: setCytoNodePositions, applyLayout: cytoLayout, configGraphConnection: configCytoGraphConnection, layoutOptions: cytoLayouts };
  } else if (GRAPH_IMPL === "sigma") {
    return { getGraph: getSigmaGraph, getNodePositions: getSigmaNodePositions, setNodePositions: setSigmaNodePositions, applyLayout: sigmaLayout, configGraphConnection: () => { }, layoutOptions: sigmaLayouts };
  } else {
    return { getGraph: getVisNetwork, getNodePositions: getVisNodePositions, setNodePositions: setVisNodePositions, applyLayout: visLayout, configGraphConnection: () => { }, layoutOptions: visLayouts };
  }
})();

export function getControls() {
  if (GRAPH_IMPL === "cytoscape") {
    return [{ name: "Zoom in", icon: Add, callback: cytoZoomIn }, { name: "Center", icon: CenterFocusStrong, callback: cytoFitTo }, { name: "Zoom Out", icon: Remove, callback: cytoZoomOut }, { name: "Export", icon: IosShareIcon, callback: cytoExportIMG }]
  }
  else if (GRAPH_IMPL === "sigma") {
    return [{ name: "Zoom in", icon: Add, callback: sigmaZoomIn }, { name: "Center", icon: CenterFocusStrong, callback: sigmaFitTo }, { name: "Zoom Out", icon: Remove, callback: sigmaZoomOut }, { name: "Export", icon: IosShareIcon, callback: sigmaExportIMG }]
  }
  else {
    return [{ name: "Zoom in", icon: Add, callback: visZoomIn }, { name: "Center", icon: CenterFocusStrong, callback: visFitTo }, { name: "Zoom Out", icon: Remove, callback: visZoomOut }, { name: "Export", icon: IosShareIcon, callback: visExportIMG }]
  }
}


export { getGraph, getNodePositions, setNodePositions, applyLayout, configGraphConnection, layoutOptions };