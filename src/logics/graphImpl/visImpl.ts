import { DataInterfaceEdges, DataInterfaceNodes, Edge, IdType, Network, Node, Options } from "vis-network";
import store from "../../app/store"
import { setSelectedEdge, setSelectedNode, Workspace } from "../../reducers/graphReducer";
import { openEdgeDialog, openNodeDialog } from "../../reducers/dialogReducer";
import { EdgeData, GraphData, GraphOptions, GraphTypes, NodeData } from "../utils";
import { setIsPhysicsEnabled } from "../../reducers/optionReducer";
import { Id } from "vis-data/declarations/data-interface";
import { DataSet } from "vis-data"
import getIcon from "../../assets/icons";

export const layoutOptions = ['force-directed', 'hierarchical']
let network: Network | null = null;
const nodes = new DataSet<Node>({})
const edges = new DataSet<Edge>({})
let shiftKeyDown = false;
let canvas: CanvasRenderingContext2D | null = null;

const defaultOptions: Options = {
  manipulation: {
    addEdge: function (data: any, _callback: any) {
      const edgeFrom = data.from;
      const edgeTo = data.to;
      store.dispatch(openEdgeDialog({ edgeFrom: edgeFrom, edgeTo: edgeTo }));
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
    if (!options.isPhysicsEnabled && options.layout != 'hierarchical') {
      curveEdges(edges);
    } else {
      edges.forEach(x => {
        network?.updateEdge(x.id!, { smooth: opts.edges?.smooth })
      })
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

function getCurvature(index: number, maxIndex: number): number {
  if (maxIndex <= 0) throw new Error("Invalid maxIndex")
  if (index < 1) throw new Error("Invalid index")
  if (maxIndex == 1) return 0
  const amplitude = .5;
  const maxCurvature = amplitude * (1 - Math.exp(-maxIndex / amplitude))
  const curve = maxCurvature * index / maxIndex
  if (maxIndex % 2 && maxIndex == index) {
    return 0
  } else if (index % 2) {
    return -2 - curve
  }
  return curve
}

function curveEdges(edges: DataSet<Edge>) {
  const map = new Map<string, number>()
  const edgeCount = new Map<IdType, number>()
  edges.get().forEach(x => {
    const key = String([x.to!, x.from!])
    const reverseKey = String([x.from!, x.to!])
    const count = map.get(key)
    const countReverse = map.get(reverseKey)
    map.set(key, (count || 0) + 1)
    const value = (count || 0) + (countReverse || 0) + 1;
    if (x.to! > x.from!) {
      edgeCount.set(x.id, value)
    } else {
      edgeCount.set(x.id, -value)
    }
  })
  edges.get().forEach(x => {
    const key = String([x.to!, x.from!])
    const reverseKey = String([x.from!, x.to!])
    const roundness = getCurvature(Math.abs(edgeCount.get(x.id)!), map.get(key)! + (map.get(reverseKey) || 0))
    const type = edgeCount.get(x.id)! < 0 ? 'curvedCW' : 'curvedCCW'
    network?.updateEdge(x.id, {
      ...x,
      smooth: {
        enabled: true,
        type: type,
        roundness: roundness
      }
    })
  })
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
    for (let e of edges.stream().keys()) {
      if (!data?.edges.map(x => x.id).includes(e)) {
        edges.remove(e)
      }
    }
    for (let e of data?.edges || []) {
      if (!edges!.get(e.id as Id) && nodes.map(x => x.id).includes(e.to)) {
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
      if ((params.nodes.length == 0) && (params.edges.length == 0) && (jsEvent.shiftKey)) {
        store.dispatch(openNodeDialog({ x: params.pointer.canvas.x, y: params.pointer.canvas.y }));
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
    network.on('afterDrawing', (ctx: CanvasRenderingContext2D) => {
      canvas = ctx;
    });

  }

  return network;
}

export function applyLayout(name: string) {
  network?.setOptions(getOptions(store.getState().options.graphOptions))
}

export function getNodePositions() {
  store.dispatch(setIsPhysicsEnabled(false))
  return {
    layout: network?.getPositions(),
    zoom: network?.getScale(),
    view: network?.getViewPosition(),
  }
}

export function setNodePositions(workspace: Workspace | undefined) {
  store.dispatch(setIsPhysicsEnabled(false))
  if (workspace !== undefined) {
    let nodeIds = Object.keys(workspace.layout);
    nodeIds.forEach((id => {
      if (network?.findNode(id) !== undefined && network?.findNode(id).length > 0)
        network?.moveNode(parseInt(id), workspace.layout[id].x, workspace.layout[id].y)
    }))
    network?.moveTo({
      position: workspace.view,
      scale: workspace.zoom
    })
  }
}

export function zoomIn() {
  const scale = network!.getScale();
  network?.moveTo({ scale: scale + 0.1 });
}

export function zoomOut() {
  const scale = network!.getScale();
  network?.moveTo({ scale: scale - 0.1 });
}

export function fitTo() {
  network?.fit();
}

export function exportIMG() {
  const container = document.querySelector('.mynetwork');
  const canvas = container?.querySelector('canvas');
  if (canvas) {
    const imageUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'graph.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error('No canvas found!');
  }
}