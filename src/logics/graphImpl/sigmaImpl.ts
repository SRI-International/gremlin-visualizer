import FA2Layout from "graphology-layout-forceatlas2/worker";
import Graph from "graphology";
import { Options } from "vis-network";
import Sigma from "sigma";
import store from "../../app/store";
import { setSelectedEdge, setSelectedNode } from "../../reducers/graphReducer";
import { GraphData } from "../utils";

let graph: Graph | null = null;
let sigma: Sigma | null = null;
let sigmaLayout: FA2Layout | null = null;

export function getSigmaGraph(container?: HTMLElement, data?: GraphData, options?: Options | undefined): Sigma | null {

  if (!sigma) {
    graph = new Graph();
    sigma = new Sigma(graph, container as HTMLElement)
    return sigma
  }
  if (container && data && graph) {
    sigma.kill()
    graph.clear()
    for (let element of data.nodes) {
      graph!.addNode(element.id!, { x: Math.random(), y: Math.random(), size: 5, label: element.label })
    }
    for (let element of data.edges) {
      graph!.addDirectedEdgeWithKey(element.id, element.from, element.to, { size: 2, type: 'arrow', label: element.label })
    }
    sigma = new Sigma(graph!, container as HTMLElement, {
      allowInvalidContainer: true,
      enableEdgeEvents: true,
      renderEdgeLabels: true,
    });
    if (!sigmaLayout) {
      sigmaLayout = new FA2Layout(graph!, {
        settings: { gravity: .1, linLogMode: true }
      });
    }
    sigmaLayout.start()
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

  }
  return sigma;
}