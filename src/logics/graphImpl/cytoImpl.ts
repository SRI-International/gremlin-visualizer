import cy, { NodeDefinition } from "cytoscape";
import { EdgeData, getColor, GraphData, GraphOptions, GraphTypes, NodeData } from "../utils";
import { ColaLayoutOptions } from "cytoscape-cola";
import store from "../../app/store";
import { selectGraph, setSelectedEdge, setSelectedNode, updateColorMap } from "../../reducers/graphReducer";
import { setIsPhysicsEnabled } from "../../reducers/optionReducer";
import getIcon from "../../assets/icons";
import cola from "cytoscape-cola";
import { useSelector } from "react-redux";

export const layoutOptions = ['force-directed', 'hierarchical', 'circle', 'grid']
let graph: cy.Core | null = null;
let layout: cy.Layouts | null = null;
let layoutName: string = 'force-directed'
const opts: ColaLayoutOptions = { name: 'cola', infinite: true, animate: true, centerGraph: false, fit: false }

cy.use(cola)

function toCyNode(n: NodeData): cy.NodeDefinition {
  let nodeColorMap = store.getState().graph.nodeColorMap
  let color = n.type !== undefined ? nodeColorMap[n.type] : '#000000';
  return {
    group: "nodes",
    data: { ...n, id: n.id!.toString() },
    style: {
      'background-color': color,
      'background-opacity': 0.7,
      'border-width': '3px',
      'border-color': color,
      'background-image': getIcon(n.type),
      'background-fit': 'contain'
    }
  }
}

function toCyEdge(e: EdgeData): cy.EdgeDefinition {
  return {
    group: "edges",
    data: { ...e, id: e.id!.toString(), source: e.from!.toString(), target: e.to!.toString() }
  }
}

export function getCytoGraph(container?: HTMLElement, data?: GraphData, options?: GraphOptions | undefined): GraphTypes {
  if (!graph) {
    graph = cy({
        container: container,
        elements: {
          nodes: [],
          edges: []
        },
        minZoom: .1,
        maxZoom: 10,
        style: [
          {
            selector: 'node',
            style: {
              label: 'data(id)'
            }
          },
          {
            selector: 'node[label]',
            style: {
              label: 'data(label)'
            }
          },
          {
            selector: 'edge',
            style: {
              width: 1,
              "curve-style": "bezier",
              "target-arrow-shape": 'triangle',
              "label": "data(label)"
            }
          }
        ]
      }
    );
    layout = graph.layout(opts)
    layout.start()
    graph.on('tap', 'node', (event) => {
      store.dispatch(setSelectedNode(event.target.id()))
    })
    graph.on('tap', 'edge', (event) => {
      store.dispatch(setSelectedEdge(event.target.id()))
    })
    graph.on('drag', 'node', e => {
      store.dispatch(setIsPhysicsEnabled(false))
    })
    return graph;
  }
  if (container && data) {

    let nodes: NodeDefinition[] = data.nodes?.map(x => {
      let nodeColorMap = Object.assign({}, store.getState().graph.nodeColorMap)
      if (x.type !== undefined && !(x.type in nodeColorMap)) {
        nodeColorMap[`${x.type}`] = getColor()
        store.dispatch(updateColorMap(nodeColorMap))
      }
      return toCyNode(x)
    }) || []
    let edges = data.edges?.map(x => toCyEdge(x)) || []
    for (let n of nodes) {
      if (!graph.nodes().map(x => x.id()).includes(n.data.id!)) {
        graph.add(n)
      }
    }
    for (let n of graph.nodes()) {
      if (!nodes.map(x => x.data.id).includes(n.id())) {
        graph.remove(n)
      }
    }
    for (let e of edges) {
      if (!graph.edges().map(x => x.id()).includes(e.data.id!)) {
        graph.add(e)
      }
    }
  }
  if (options) {
    if (options.isPhysicsEnabled) applyLayout(layoutName)
    else layout?.stop();
  }

  return graph;
}

export function applyLayout(name: string) {
  layoutName = name
  if (!graph || !layout) return
  layout.stop()
  switch (name) {
    case 'force-directed': {
      layout = graph.layout({ ...opts, ...{ infinite: store.getState().options.graphOptions.isPhysicsEnabled } })
      store.dispatch(setIsPhysicsEnabled(true))
      break
    }
    case 'circle': {
      layout = graph.layout({ name: "circle" })
      store.dispatch(setIsPhysicsEnabled(false))
      break
    }
    case 'hierarchical': {
      layout = graph.layout({ name: "breadthfirst" })
      store.dispatch(setIsPhysicsEnabled(false))
      break
    }
    case 'grid': {
      layout = graph.layout({ name: 'grid' })
      store.dispatch(setIsPhysicsEnabled(false))
      break
    }
    default: {
      console.warn(`Unknown layout ${name} applied`)
    }
  }
  layout.start()

  return graph;
}

export function getNodePositions() {
  let positions: Record<string, { x: number, y: number }> = {};
  graph?.nodes().forEach(node => {
    positions[node.data('id')] = node.position()
  })
  return positions;
}

export function setNodePositions(name: string) {
  let workspace = useSelector(selectGraph).workspaces.find(workspace => workspace.name === name);
  graph?.nodes().forEach(node => {
    let newPosition = workspace?.layout[node.data('id')]
    if (newPosition !== undefined) node.position(newPosition);
  })
}