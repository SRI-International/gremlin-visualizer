import FA2Layout from "graphology-layout-forceatlas2/worker";
import Graph from "graphology";
import Sigma from "sigma";
import store from "../../app/store";
import { setSelectedEdge, setSelectedNode, updateColorMap } from "../../reducers/graphReducer";
import { GraphData, GraphTypes, GraphOptions, getColor } from "../utils";
import { setIsPhysicsEnabled } from "../../reducers/optionReducer";
import { createNodeImageProgram } from "@sigma/node-image";
import getIcon from "../../assets/icons";
import { circular } from "graphology-layout";
import { animateNodes } from "sigma/utils";

export const layoutOptions = ['force-directed', 'circular']
const graph: Graph = new Graph();
let sigma: Sigma | null = null;
let sigmaLayout: FA2Layout | null = null;
let layoutName = 'force-directed'

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
    if (options.isPhysicsEnabled) applyLayout(layoutName)
    else sigmaLayout?.stop()
  }
  // updates graph data
  if (container && data) {
    for (let element of data.nodes) {
      if (!graph.nodes().includes(element.id!.toString())) {
        let nodeColorMap = Object.assign({}, store.getState().graph.nodeColorMap)
        if (element.type !== undefined && !(element.type in nodeColorMap)) {
          nodeColorMap[`${element.type}`] = getColor()
          store.dispatch(updateColorMap(nodeColorMap))
        }
        let color = element.type !== undefined ? nodeColorMap[element.type] : '#000000'
        graph.addNode(element.id!, {
          x: Math.random(),
          y: Math.random(),
          size: 5,
          label: element.label,
          color: color,
          image: getIcon(element.type)
        })
      }
    }
    for (let id of graph!.nodes()) {
      if (!data.nodes.map(x => x.id!.toString()).includes(id)) {
        graph.dropNode(id)
      }
    }
    for (let element of data.edges) {
      if (!graph.edges().includes(element.id!.toString())) {
        graph.addDirectedEdgeWithKey(element.id, element.from, element.to, {
          size: 2,
          type: 'arrow',
          label: element.label
        })
      }
    }
  }
  return sigma;
}

export function applyLayout(name: string) {
  layoutName = name
  if (!sigma) return
  sigmaLayout?.stop()
  switch (name) {
    case 'circular': {
      sigmaLayout = null
      const circularPosition = circular(graph)
      animateNodes(graph, circularPosition, { duration: 1000 })
      store.dispatch(setIsPhysicsEnabled(false))
      break
    }
    case 'force-directed': {
      sigmaLayout = new FA2Layout(graph!, {
        settings: { gravity: .1, linLogMode: true }
      });
      sigmaLayout.start()
      store.dispatch(setIsPhysicsEnabled(true))
      break
    }
    default: {
      console.warn(`Unknown layout ${name} applied`)
    }
  }
}