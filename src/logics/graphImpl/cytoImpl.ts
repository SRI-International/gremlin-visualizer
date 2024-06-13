import { Edge, Node } from "vis-network";
import cy, { NodeDefinition } from "cytoscape";
import { GraphData, GraphTypes, GraphOptions } from "../utils";
import { ColaLayoutOptions } from "cytoscape-cola";
import store from "../../app/store";
import { setSelectedEdge, setSelectedNode } from "../../reducers/graphReducer";
import cola from "cytoscape-cola";
import { setIsPhysicsEnabled } from "../../reducers/optionReducer";

let graph: cy.Core | null = null;
let layout: cy.Layouts | null = null;
const opts: ColaLayoutOptions = { name: 'cola', infinite: true, animate: true, centerGraph: false, fit: false }

cy.use(cola)

function toCyNode(n: Node): cy.NodeDefinition {
  return { group: "nodes", data: { ...n, id: n.id!.toString() } }
}

function toCyEdge(e: Edge): cy.EdgeDefinition {
  return {
    group: "edges",
    data: { ...e, id: e.id!.toString(), source: e.from!.toString() , target: e.to!.toString() }
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
  if(container && data) {
    let nodes: NodeDefinition[] = data.nodes?.map(x => toCyNode(x)) || []
    let edges = data.edges?.map(x => toCyEdge(x)) || []
    for(let n of nodes) {
      if(!graph.nodes().map(x => x.id()).includes(n.data.id!)) {
        graph.add(n)
      }
    }
    for(let n of graph.nodes()) {
      if(!nodes.map(x => x.data.id).includes(n.id())) {
        graph.remove(n)
      }
    }
    for(let e of edges) {
      if(!graph.edges().map(x => x.id()).includes(e.data.id!)) {
        graph.add(e)
      }
    }
  }
  if(options) {
    if(options.isPhysicsEnabled) {
      layout?.stop()
      layout = graph.layout({...opts, ...{infinite: options.isPhysicsEnabled}})
      layout.start()
    } else {
      layout?.stop()
    }
  }

  return graph;
}