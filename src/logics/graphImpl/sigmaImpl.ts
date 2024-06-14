import FA2Layout from "graphology-layout-forceatlas2/worker";
import Graph from "graphology";
import Sigma from "sigma";
import store from "../../app/store";
import { setSelectedEdge, setSelectedNode, updateColorMap } from "../../reducers/graphReducer";
import { GraphData, GraphTypes, GraphOptions, getColor } from "../utils";
import { setIsPhysicsEnabled } from "../../reducers/optionReducer";
import { createNodeImageProgram } from "@sigma/node-image";
import getIcon from "../../assets/icons";

const graph: Graph = new Graph();
let sigma: Sigma | null = null;
let sigmaLayout: FA2Layout | null = null;

function createSigmaGraph(container: HTMLElement) {
  const sigma = new Sigma(graph!, container as HTMLElement, {
    allowInvalidContainer: true,
    enableEdgeEvents: true,
    renderEdgeLabels: true,
    defaultNodeType: "image",
    nodeProgramClasses: {
      image: createNodeImageProgram({
        correctCentering: true,
        objectFit: 'cover'
      })
    },
  });
  sigma.on("clickEdge", e => {
    store.dispatch(setSelectedEdge(e.edge))
  })
  sigma.on("clickNode", (e) => {
    store.dispatch(setSelectedNode(e.node))
  });

  // State for drag'n'drop
  let draggedNode: string | null = null;
  let isDragging = false;

  // On mouse down on a node
  //  - we enable the drag mode
  //  - save in the dragged node in the state
  //  - highlight the node
  //  - disable the camera so its state is not updated
  sigma.on("downNode", (e) => {
    sigmaLayout?.stop()
    store.dispatch(setIsPhysicsEnabled(false))
    isDragging = true;
    draggedNode = e.node;
    graph!.setNodeAttribute(draggedNode, "highlighted", true);
  });

  // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
  sigma.getMouseCaptor().on("mousemovebody", (e) => {
    if (!isDragging || !draggedNode) return;

    // Get new position of node
    const pos = sigma!.viewportToGraph(e);

    graph!.setNodeAttribute(draggedNode, "x", pos.x);
    graph!.setNodeAttribute(draggedNode, "y", pos.y);

    // Prevent sigma to move camera:
    e.preventSigmaDefault();
    e.original.preventDefault();
    e.original.stopPropagation();
  });

  // On mouse up, we reset the autoscale and the dragging mode
  sigma.getMouseCaptor().on("mouseup", () => {
    if (draggedNode) {
      graph!.removeNodeAttribute(draggedNode, "highlighted");
    }
    isDragging = false;
    draggedNode = null;
  });

  // Disable the autoscale at the first down interaction
  sigma.getMouseCaptor().on("mousedown", () => {
    if (!sigma!.getCustomBBox()) sigma!.setCustomBBox(sigma!.getBBox());
  });
  return sigma
}

export function getSigmaGraph(container?: HTMLElement, data?: GraphData, options?: GraphOptions | undefined): GraphTypes {
  // create graph if it doesn't exist
  if (!sigma) {
    sigma = createSigmaGraph(container!)
    sigmaLayout = new FA2Layout(graph!, {
      settings: { gravity: .1, linLogMode: true }
    });
    if (options?.isPhysicsEnabled) {
      sigmaLayout.start()
    }
    return sigma
  }
  // update options
  if (options) {
    if(options.isPhysicsEnabled) sigmaLayout?.start(); else sigmaLayout?.stop();
  }
  // updates graph data
  if (container && data) {
    for (let element of data.nodes) {
      if (!graph.nodes().includes(element.id!.toString())) {
        let nodeColorMap = Object.assign({}, store.getState().graph.nodeColorMap)
        if ( element.group !== undefined && !(element.group in nodeColorMap) ) {
          nodeColorMap[`${element.group}`] = getColor()
          store.dispatch(updateColorMap(nodeColorMap))
        }
        let color = element.group !== undefined ? nodeColorMap[element.group] : '#ffffff'
        graph.addNode(element.id!, { x: Math.random(), y: Math.random(), size: 5, label: element.label, color: color, image: getIcon(element.group) })
      }
    }
    for (let id of graph!.nodes()) {
      if(!data.nodes.map(x => x.id!.toString()).includes(id)) {
        graph.dropNode(id)
      }
    }
    for (let element of data.edges) {
      if(!graph.edges().includes(element.id!.toString())) {
        graph.addDirectedEdgeWithKey(element.id, element.from, element.to, { size: 2, type: 'arrow', label: element.label })
      }
    }
  }
  return sigma;
}