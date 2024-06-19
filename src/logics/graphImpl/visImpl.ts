import { DataInterfaceEdges, DataInterfaceNodes, Edge, Network, Node, Options } from "vis-network";
import store from "../../app/store"
import { setSelectedEdge, setSelectedNode, Workspace } from "../../reducers/graphReducer";
import {openNodeDialog, openEdgeDialog} from "../../reducers/dialogReducer";
import { EdgeData, GraphData, GraphOptions, GraphTypes, NodeData, extractEdgesAndNodes } from "../utils";
import { setIsPhysicsEnabled } from "../../reducers/optionReducer";
import { Id } from "vis-data/declarations/data-interface";
import { DataSet } from "vis-data"
import getIcon from "../../assets/icons";
import { networkDOTParser } from "vis-network/esnext";

export const layoutOptions = ['force-directed', 'hierarchical']
let network: Network | null = null;
const nodes = new DataSet<Node>({})
const edges = new DataSet<Edge>({})
let shiftKeyDown = false;

const defaultOptions: Options = {
  manipulation: {
    addEdge: function (data: any, _callback: any) {
      const edgeFrom = data.from;
      const edgeTo = data.to;
      store.dispatch(openEdgeDialog({edgeFrom : edgeFrom, edgeTo: edgeTo}));
    }
  },
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
  nodes: {
    shape: 'dot',
    size: 20,
    borderWidth: 2,
    font: {
      size: 11,
    }
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
    switch (options.layout) {
      case 'force-directed': {
        opts.layout = { hierarchical: false }
        break;
      }
      case 'hierarchical': {
        opts.layout = {
          hierarchical: {
            enabled: true,
            direction: "UD",
            sortMethod: "directed",
          }
        }
        break;
      }
      default: {
        console.log(`Unknown layout ${options.layout} applied`)
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
  let icon = getIcon(node.type);
  if (icon) {
    gNode = { ...gNode, ...{ image: icon, shape: 'circularImage' } }
  }
  return gNode
}

export function getVisNetwork(container?: HTMLElement, data?: GraphData, options?: GraphOptions | undefined): GraphTypes {
  if (network) {
    for (let n of data?.nodes || []) {
      if (!nodes!.get(n.id as Id)) {
        nodes.add(toVisNode(n))
      } else {
        nodes.update(toVisNode({ ...n, ...{ x: undefined, y: undefined } }))
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
        store.dispatch(openNodeDialog({x: params.pointer.canvas.x, y: params.pointer.canvas.y}));
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Shift' && shiftKeyDown !== true) {
        shiftKeyDown = true;
        network!.addEdgeMode();
      }
    }
    );
    document.addEventListener('keyup', function (e) {
      if (e.key === 'Shift' && shiftKeyDown === true) {
        shiftKeyDown = false;
        network!.disableEditMode();
      }
    });
  }

  return network;
}

export function applyLayout(name: string) {
  network?.setOptions(getOptions(store.getState().options.graphOptions))
}

export function getNodePositions() {
  return network?.getPositions()
}

export function setNodePositions(workspace: Workspace | undefined) {
  if (workspace !== undefined) {
    let nodeIds = Object.keys(workspace.layout);
    nodeIds.forEach((id => {
      if (network?.findNode(id) !== undefined && network?.findNode(id).length > 0)
        network?.moveNode(parseInt(id), workspace.layout[id].x, workspace.layout[id].y)
    }))
  }

}