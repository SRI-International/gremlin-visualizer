import { Edge, Node, Options } from "vis-network";
import cy, { NodeDefinition } from "cytoscape";
import { GraphData } from "../utils";
import { ColaLayoutOptions } from "cytoscape-cola";
import store from "../../app/store";
import { setSelectedEdge, setSelectedNode } from "../../reducers/graphReducer";

let cytoImpl: cy.Core | null = null;

function toCyNode(n: Node): cy.NodeDefinition {
  return { group: "nodes", data: { ...n, id: n.id?.toString() as string | undefined } }
}

function toCyEdge(e: Edge): cy.EdgeDefinition {
  return {
    group: "edges",
    data: { ...e, id: e.id?.toString(), source: e.from?.toString() || '', target: e.to?.toString() || '' }
  }
}

export function getCytoGraph(container?: HTMLElement, data?: GraphData, options?: Options | undefined): cy.Core | null {
  let nodes: NodeDefinition[] = data?.nodes?.map(x => toCyNode(x)) || []
  let edges = data?.edges?.map(x => toCyEdge(x)) || []
  cytoImpl = cy({
    container: container,
    elements: {
      nodes: nodes,
      edges: edges
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
  });
  const opts: ColaLayoutOptions = { name: 'cola', infinite: true, animate: true, centerGraph: false, fit: false }
  cytoImpl.layout(opts).start()
  cytoImpl.on('tap', 'node', (event) => {
    store.dispatch(setSelectedNode(event.target.id()))
  })
  cytoImpl.on('tap', 'edge', (event) => {
    store.dispatch(setSelectedEdge(event.target.id()))
  })

  return cytoImpl;
}