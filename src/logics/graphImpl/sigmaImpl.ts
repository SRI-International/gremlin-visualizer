import FA2Layout from "graphology-layout-forceatlas2/worker";
import Graph from "graphology";
import Sigma from "sigma";
import store from "../../app/store";
import { selectGraph, setSelectedEdge, setSelectedNode, updateColorMap, Workspace } from "../../reducers/graphReducer";
import { GraphData, GraphTypes, GraphOptions, getColor } from "../utils";
import { setIsPhysicsEnabled } from "../../reducers/optionReducer";
import { createNodeImageProgram } from "@sigma/node-image";
import getIcon from "../../assets/icons";
import { openNodeDialog } from "../../reducers/dialogReducer";
import { circular } from "graphology-layout";
import { animateNodes } from "sigma/utils";
import { useSelector } from "react-redux";

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

  sigma.on('clickStage', function (params) {
    let jsEvent = params.event.original;
    if (jsEvent.shiftKey) {
      store.dispatch(openNodeDialog({ x: params.event.x, y: params.event.y }));
    }
  });
  return sigma
}

export function getSigmaGraph(container?: HTMLElement, data?: GraphData, options?: GraphOptions | undefined): GraphTypes {
  // create graph if it doesn't exist
  if (!sigma) {
    sigma = createSigmaGraph(container!)
    sigmaLayout = new FA2Layout(graph!, {
      settings: { gravity: .01, linLogMode: true }
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
      let nodeColorMap = Object.assign({}, store.getState().graph.nodeColorMap)
      if (element.type !== undefined && !(element.type in nodeColorMap)) {
        nodeColorMap[`${element.type}`] = getColor()
        store.dispatch(updateColorMap(nodeColorMap))
      }
      let color = element.type !== undefined ? nodeColorMap[element.type] : '#000000'
      if (!graph.nodes().includes(element.id!.toString())) {
        let pos = { x: Math.random(), y: Math.random() }
        if (element.x && element.y) {
          pos = sigma.viewportToGraph({ x: element.x, y: element.y })
        }
        let {x, y} = pos
        graph.addNode(element.id!, {
          x: x,
          y: y,
          size: 5,
          label: element.label,
          color: color,
          image: getIcon(element.type)
        })
      } else {
        graph.updateNode(element.id!, attr => {
          return {
            ...attr,
            label: element.label,
            color: color,
          }
        })
      }
    }
    for (let id of graph!.nodes()) {
      if (!data.nodes.map(x => x.id!.toString()).includes(id)) {
        graph.dropNode(id)
      }
    }
    for (let element of data.edges) {
      if (!graph.edges().includes(element.id!.toString()) && graph.nodes().includes(element.to!.toString())) {
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

export function getNodePositions() {
  let positions: Record<string, { x: number, y: number }> = {};
  sigma?.getGraph().forEachNode((node, attributes) => {
    positions[node] = { x: attributes.x, y: attributes.y }
  })
  return positions
}

export function setNodePositions(workspace: Workspace | undefined) {
  graph.forEachNode((node, attributes) => {
    let newPosition = workspace?.layout[node]
    if (newPosition !== undefined) graph.updateNode(node, attributes => {
      return {
        ...attributes,
        x: newPosition?.x,
        y: newPosition?.y
      }
    })
  })
}