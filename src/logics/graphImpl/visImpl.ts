import { DataInterfaceEdges, DataInterfaceNodes, Edge, Node, Network, Options } from "vis-network";
import store from "../../app/store"
import { setSelectedEdge, setSelectedNode } from "../../reducers/graphReducer";
import {openDialog, setCoordinates} from "../../reducers/dialogReducer";
import { EdgeData, GraphData, GraphOptions, GraphTypes, NodeData, extractEdgesAndNodes } from "../utils";
import { setIsPhysicsEnabled } from "../../reducers/optionReducer";
import { Id } from "vis-data/declarations/data-interface";
import { DataSet } from "vis-data"
import getIcon from "../../assets/icons";



let network: Network | null = null;
const nodes = new DataSet<Node>({})
const edges = new DataSet<Edge>({})
const defaultOptions: Options = {
  physics: {
    forceAtlas2Based: {
      gravitationalConstant: -26,
      centralGravity: 0.005,
      springLength: 230,
      springConstant: 0.18,
      avoidOverlap: 1.5,
    },
    maxVelocity: 40,
    solver: 'forceAtlas2Based',
    timestep: 0.35,
    stabilization: {
      enabled: true,
      iterations: 50,
      updateInterval: 25,
    },
  },
  // layout: {
  //   hierarchical: {
  //     enabled: true,
  //     direction: "UD",
  //     sortMethod: "directed",
  //   }
  // },
  nodes: {
    shape: 'dot',
    size: 20,
    borderWidth: 2,
    font: {
      size: 11,
    },
  },
  edges: {
    width: 2,
    font: {
      size: 11,
    },
    smooth: {
      enabled: true,
      type: 'dynamic',
      roundness: 0,
    },
  },
} as Options

function getOptions(options?: GraphOptions): Options {
  const opts = { ...defaultOptions }
  if (options) {
    opts.physics.enabled = options.isPhysicsEnabled
    if (!options.isPhysicsEnabled) {
      opts.edges!.smooth = {
        enabled: true,
        type: 'continuous',
        roundness: 1
      }
    } else {
      opts.edges!.smooth = {
        enabled: true,
        type: 'dynamic',
        roundness: 0
      }
    }
  }
  return opts
}

function toVisEdge(edge: EdgeData) {
  return { ...edge, type: edge.label, arrows: { to: { enabled: true, scaleFactor: 0.5 } } }
}

function toVisNode(node: NodeData): Node {
  let gNode = { ...node, ...{ group: node.type } }
  let icon = getIcon(node.label);
  if (icon) {
    gNode = { ...gNode, ...{ image: icon, shape: 'image' } }
  }
  return gNode
}

export function getVisNetwork(container?: HTMLElement, data?: GraphData, options?: GraphOptions | undefined): GraphTypes {
  if (network) {
    for (let n of data?.nodes || []) {
      if (!nodes!.get(n.id as Id)) {
        nodes.add(toVisNode(n))
      } else {
        nodes.update(toVisNode(n))
      }
    }
    for (let e of data?.edges || []) {
      if (!edges!.get(e.id as Id)) {
        edges.add(toVisEdge(e))
      }
    }
    for (let n of nodes.stream().keys()) {
      if (!data?.nodes.map(x => x.id).includes(n)) {
        nodes.remove(n)
      }
    }
    if (options) {
      network.setOptions(getOptions(options));
    }
    return network;
  }

  if (container && data) {
    network = new Network(container, {
      nodes: nodes as DataInterfaceNodes,
      edges: edges as DataInterfaceEdges
    }, getOptions(options));
    network.on('selectNode', (params?: any) => {
      const nodeId =
        params.nodes && params.nodes.length > 0 ? params.nodes[0] : null;
      store.dispatch(setSelectedNode(nodeId));
    });
    network.on('selectEdge', (params?: any) => {
      const edgeId =
        params.edges && params.edges.length === 1 ? params.edges[0] : null;
      const isNodeSelected = params.nodes && params.nodes.length > 0;
      if (!isNodeSelected && edgeId !== null) {
        store.dispatch(setSelectedEdge(edgeId));
      }
    });
    network.on("dragging", function (params) {
      // disable physics only when dragging a node
      if (!params.nodes[0]) {
        return
      }
      store.dispatch(setIsPhysicsEnabled(false))
    });
    network.on('click', function (params) {
      let jsEvent = params.event.srcEvent;
      if((params.nodes.length == 0) && (params.edges.length == 0) && (jsEvent.shiftKey)) {
        store.dispatch(setCoordinates({x: params.pointer.canvas.x, y: params.pointer.canvas.y}));
        store.dispatch(openDialog());   
    }
    });
  }

  return network;
}

