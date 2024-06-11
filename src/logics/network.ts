import { Data, Network, Options, Node, Edge, IdType } from "vis-network";
import cy, { NodeDefinition } from "cytoscape";
import cola, { ColaLayoutOptions } from "cytoscape-cola";
import { GRAPH_IMPL } from "../constants";
import store from "../app/store"
import { setSelectedEdge, setSelectedNode } from "../reducers/graphReducer";

cy.use(cola)

let network: Network | null = null;
let cytoGraph: cy.Core | null = null

function toCyNode(n: Node): cy.NodeDefinition {
  return { group: "nodes", data: { ...n, id: n.id?.toString() as string | undefined } }
}

function toCyEdge(e: Edge): cy.EdgeDefinition {
  return {
    group: "edges",
    data: { ...e, id: e.id?.toString(), source: e.from?.toString() || '', target: e.to?.toString() || '' }
  }
}

function getCytoNetwork(container?: HTMLElement, data?: Data, options?: Options | undefined): cy.Core | null {
  let nodes: NodeDefinition[] = data?.nodes?.map(x => toCyNode(x)) || []
  let edges = data?.edges?.map(x => toCyEdge(x)) || []
  cytoGraph = cy({
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
  cytoGraph.layout(opts).start()
  cytoGraph.on('tap', 'node', (event) => {
    store.dispatch(setSelectedNode(event.target.id()))
  })
  cytoGraph.on('tap', 'edge', (event) => {
    store.dispatch(setSelectedEdge(event.target.id()))
  })

  return cytoGraph;
}


function getVisNetwork(container?: HTMLElement, data?: Data, options?: Options | undefined): Network | null {
  if (network) {
    if (data) network.setData(data);
    if (options) network.setOptions(options);
    return network;
  }

  if (container && data) {
    network = new Network(container, data, options);
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
  }

  return network;
}

const getNetwork = (() => {
  if (GRAPH_IMPL === "cytoscape") {
    return getCytoNetwork;
  } else {
    return getVisNetwork;
  }
})();
export { getNetwork };