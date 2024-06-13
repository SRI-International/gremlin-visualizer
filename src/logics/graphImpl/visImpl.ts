import { Data, DataInterfaceEdges, DataInterfaceNodes,  EdgeOptions, Network, Options } from "vis-network";
import cy from "cytoscape";
import cola from "cytoscape-cola";
import store from "../../app/store"
import { setSelectedEdge, setSelectedNode } from "../../reducers/graphReducer";
import { GraphData } from "../utils";
import { setIsPhysicsEnabled } from "../../reducers/optionReducer";
import { Id } from "vis-data/declarations/data-interface";
import { DataSet } from "vis-data"

cy.use(cola)

let network: Network | null = null;
const nodes = new DataSet({})
const edges = new DataSet({})


export function getVisNetwork(container?: HTMLElement, data?: GraphData, options?: Options | undefined): Network | null {
  debugger;
  if (network) {
    for(let n of data?.nodes || []) {
      if(!nodes!.get(n.id as Id)) {
        console.log(`add ${n}`)
        nodes.add(n)
      }
    }
    for(let e of data?.edges || []) {
      if(!edges!.get(e.id as Id)) {
        edges.add(e)
      }
    }
    for(let n of nodes.stream().keys()) {
      if (!data?.nodes.map(x => x.id).includes(n)) {
        console.log(`remove ${n}`)
        nodes.remove(n)
      }
    }
    if (options) network.setOptions(options);
    return network;
  }

  if (container && data) {
    network = new Network(container, {nodes: nodes as DataInterfaceNodes, edges: edges as DataInterfaceEdges}, options);
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
          enabled: false,
          roundness: 10,
          type: 'continuous',
        },
      };
      network!.setOptions({ physics: false, edges });
      store.dispatch(setIsPhysicsEnabled(false))
    });
  }

  return network;
}

