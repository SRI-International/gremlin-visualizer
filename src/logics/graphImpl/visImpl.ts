import { DataInterfaceEdges, DataInterfaceNodes, EdgeOptions, Network, Options } from "vis-network";
import store from "../../app/store"
import { setSelectedEdge, setSelectedNode } from "../../reducers/graphReducer";
import { GraphData, GraphOptions, GraphTypes } from "../utils";
import { setIsPhysicsEnabled } from "../../reducers/optionReducer";
import { Id } from "vis-data/declarations/data-interface";
import { DataSet } from "vis-data"
import Graph from "graphology";


let network: Network | null = null;
const nodes = new DataSet({})
const edges = new DataSet({})
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
      type: 'dynamic',
    },
  },
} as Options

function getOptions(options?: GraphOptions) {
  const opts = {...defaultOptions}
  if(options) {
    opts.physics.enabled = options.isPhysicsEnabled
  }
  return opts
}

export function getVisNetwork(container?: HTMLElement, data?: GraphData, options?: GraphOptions | undefined): GraphTypes {
  if (network) {
    for (let n of data?.nodes || []) {
      if (!nodes!.get(n.id as Id)) {
        console.log(`add ${n}`)
        nodes.add(n)
      }
    }
    for (let e of data?.edges || []) {
      if (!edges!.get(e.id as Id)) {
        edges.add(e)
      }
    }
    for (let n of nodes.stream().keys()) {
      if (!data?.nodes.map(x => x.id).includes(n)) {
        console.log(`remove ${n}`)
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
    })
    network.on('selectEdge', (params?: any) => {
      const edgeId =
        params.edges && params.edges.length === 1 ? params.edges[0] : null;
      const isNodeSelected = params.nodes && params.nodes.length > 0;
      if (!isNodeSelected && edgeId !== null) {
        store.dispatch(setSelectedEdge(edgeId));
      }
    })
    network.on("dragging", function (params) {
      const edges: EdgeOptions = {
        smooth: {
          enabled: true,
          type: 'continuous',
          roundness: 1,
        },
      };
      network!.setOptions({ physics: false, edges });
      store.dispatch(setIsPhysicsEnabled(false))
    });
  }

  return network;
}

